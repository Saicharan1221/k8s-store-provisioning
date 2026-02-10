import { useEffect, useState } from "react";

const API = "http://localhost:3000";

function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    const res = await fetch(`${API}/stores`);
    const data = await res.json();
    setStores(data);
  };

  const createStore = async () => {
    setLoading(true);
    await fetch(`${API}/stores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dashboard Store",
        type: "woocommerce",
      }),
    });
    setLoading(false);
    fetchStores();
  };

  const deleteStore = async (id) => {
    await fetch(`${API}/stores/${id}`, {
      method: "DELETE",
    });
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Store Provisioning Dashboard</h1>

      <button onClick={createStore} disabled={loading}>
        {loading ? "Creating..." : "Create New Store"}
      </button>

      <hr />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Namespace</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.id}</td>
              <td>{store.name}</td>
              <td>{store.status}</td>
              <td>{store.namespace}</td>
              <td>{store.created_at}</td>
              <td>
                <button onClick={() => deleteStore(store.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
