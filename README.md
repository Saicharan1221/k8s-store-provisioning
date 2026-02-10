KUBERNETES STORE PROVISIONING PLATFORM
=====================================

PROJECT OVERVIEW
----------------
This project is a Kubernetes-native store provisioning platform that dynamically creates isolated ecommerce stores using WordPress + WooCommerce.

Each store is deployed using Helm into its own Kubernetes namespace. A Node.js backend orchestrates the lifecycle of stores, and a React dashboard provides a UI for creating, viewing, and deleting stores.

The same Helm-based setup works on local Kubernetes (kind) and production-like environments (k3s) using configuration changes only.

---

ARCHITECTURE DIAGRAM
--------------------

                    +----------------------+
                    |  React Dashboard     |
                    |  (store-dashboard)   |
                    |  http://localhost:5173
                    +----------+-----------+
                               |
                               | REST API (HTTP)
                               v
                    +----------------------+
                    |  Node.js Backend     |
                    |  (store-backend)     |
                    |  http://localhost:3000
                    |----------------------|
                    |  - Store APIs        |
                    |  - SQLite Metadata   |
                    |  - Helm / kubectl    |
                    +----------+-----------+
                               |
                               | Kubernetes API
                               v
        +--------------------------------------------------+
        |          Kubernetes Cluster (kind / k3s)         |
        |--------------------------------------------------|
        |                                                  |
        |  Namespace: store-<id>                           |
        |  ----------------------                          |
        |  | WordPress Pod       |                         |
        |  | WooCommerce Plugin  |                         |
        |  |-------------------- |                         |
        |  | MariaDB Pod         |                         |
        |  | Persistent Volume   |                         |
        |  ----------------------                          |
        |                                                  |
        +--------------------------------------------------+

Each store runs in its own namespace with isolated resources.

---

TECH STACK
----------
Frontend: React + Vite  
Backend: Node.js + Express  
Platform DB: SQLite  
Ecommerce: WordPress + WooCommerce  
Orchestration: Kubernetes  
Packaging: Helm  
Local Cluster: kind  
Production-like Cluster: k3s  

---
## 📂 Project Structure
<pre>
k8s-store-provisioning
│
├── store-backend
│   ├── src
│   │   ├── index.js
│   │   ├── routes
│   │   │   └── stores.js
│   │   └── db
│   │       └── database.js
│   └── package.json
│
├── store-dashboard
│   ├── src
│   │   └── App.jsx
│   └── package.json
│
└── README.md
</pre>


---

FEATURES
--------
- Dynamic store provisioning using Helm
- Namespace-per-store isolation
- Persistent storage using PVCs
- Node.js REST APIs (POST / GET / DELETE)
- React dashboard to manage stores
- Multiple stores provisioned concurrently
- End-to-end WooCommerce order flow
- Clean teardown of stores
- Restart-safe architecture

---

LOCAL SETUP (KIND)
------------------

PREREQUISITES
-------------
- Docker Desktop
- Node.js
- kubectl
- Helm
- kind

Verify:
docker --version
kubectl version --client
helm version
kind version

---

CREATE CLUSTER
--------------
kind create cluster --name store-cluster
kubectl get nodes

---

INSTALL INGRESS
---------------
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

---

BACKEND SETUP
-------------
cd store-backend
npm install
node src/index.js

Backend URL:
http://localhost:3000

---

DASHBOARD SETUP
---------------
cd store-dashboard
npm install
npm run dev

Dashboard URL:
http://localhost:5173

---

STORE LIFECYCLE
---------------

CREATE STORE
------------
POST /stores

Backend actions:
- Generate store ID
- Create Kubernetes namespace
- Deploy WordPress + WooCommerce via Helm
- Store metadata in SQLite

---

VIEW STORES
-----------
GET /stores

Shows:
- Store ID
- Status (Provisioning / Ready)
- Namespace
- Created timestamp

---

ACCESS WORDPRESS
----------------
kubectl port-forward -n store-<id> svc/store-<id>-wp-wordpress 8086:80

Open:
http://localhost:8086
http://localhost:8086/wp-admin

---

WOOCOMMERCE ORDER FLOW
---------------------
1. Install WooCommerce
2. Create product
3. Add to cart
4. Checkout (Cash on Delivery)
5. Verify order in admin panel

---

DELETE STORE
------------
DELETE /stores/:id

Cleanup:
- Helm uninstall
- Kubernetes resources removed
- Namespace deleted
- Metadata removed

---

PRODUCTION (K3S)
----------------
Same Helm charts used.
Changes via Helm values only:
- DNS / ingress
- StorageClass
- Secrets
- Optional TLS

---

SYSTEM DESIGN & TRADEOFFS
-------------------------
- Namespace-per-store ensures strong isolation
- Helm provides idempotent deployments
- SQLite chosen for simplicity
- Port-forward locally, ingress in production
- PVCs guarantee data persistence

---

DEMO FLOW
---------
1. Show dashboard
2. Create store
3. Show Kubernetes namespace
4. Access WordPress
5. Create product
6. Place order
7. Delete store

---

FINAL STATUS
------------
All deliverables completed:
- Backend
- Dashboard
- Kubernetes orchestration
- Helm deployments
- End-to-end ecommerce flow
- GitHub repository ready

END OF DOCUMENT


