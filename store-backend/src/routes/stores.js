const express = require('express');
const db = require('../db/database');
const { exec } = require('child_process');


const router = express.Router();
router.get('/ping', (req, res) => res.send('ping-ok'));


// POST /stores
router.post('/', (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'name and type are required' });
  }

  const id = `store-${Date.now()}`;
  const namespace = id;
  const helmRelease = `${id}-wp`;
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO stores (id, name, type, namespace, helm_release, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name,
    type,
    namespace,
    helmRelease,
    'Provisioning',
    createdAt
  );

exec(`kubectl create namespace ${namespace}`, (error, stdout, stderr) => {
  if (error) {
    console.error('Namespace creation failed:', error.message);
  } else {
    console.log('Namespace created:', namespace);
  }
});

exec(
  `helm install ${helmRelease} bitnami/wordpress -n ${namespace}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error('Helm install failed:', error.message);
    } else {
      console.log('Helm install started for', helmRelease);
    }
  }
);


  res.status(201).json({
    id,
    name,
    type,
    namespace,
    status: 'Provisioning'
  });
});

// GET /stores - list all stores
router.get('/', (req, res) => {
  const stores = db.prepare('SELECT * FROM stores').all();
  res.json(stores);
});


// GET /stores/test-kubectl
router.get('/test-kubectl', (req, res) => {
  exec('kubectl get namespaces', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

// DELETE /stores/:id - full cleanup
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Get store details first
  const store = db
    .prepare('SELECT * FROM stores WHERE id = ?')
    .get(id);

  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }

  const namespace = store.namespace;
  const helmRelease = store.helm_release;

  // 1. Helm uninstall
  exec(
    `helm uninstall ${helmRelease} -n ${namespace}`,
    (helmErr) => {
      if (helmErr) {
        console.error('Helm uninstall error:', helmErr.message);
      }

      // 2. Delete namespace
      exec(
        `kubectl delete namespace ${namespace}`,
        (nsErr) => {
          if (nsErr) {
            console.error('Namespace delete error:', nsErr.message);
          }

          // 3. Delete from DB
          db.prepare('DELETE FROM stores WHERE id = ?').run(id);

          res.json({
            message: 'Store fully deleted',
            id
          });
        }
      );
    }
  );
});






module.exports = router;
