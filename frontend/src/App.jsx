import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/items/");
      setItems(res.data);
    } catch (err) {
      console.error("GET error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // PUT request (replace whole item)
        await axios.put(`http://localhost:8000/api/items/${editingId}/`, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
        });
        setEditingId(null);
      } else {
        // POST request
        await axios.post("http://localhost:8000/api/items/", {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
        });
      }

      setForm({ name: "", description: "", price: "" });
      fetchItems();
    } catch (err) {
      console.error("Submit error:", err.response.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/items/${id}/`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("DELETE error:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
    });
  };

  const handlePatchPrice = async (id) => {
    const newPrice = prompt("Enter new price:");
    if (!newPrice) return;

    try {
      await axios.patch(`http://localhost:8000/api/items/${id}/`, {
        price: parseFloat(newPrice),
      });
      fetchItems();
    } catch (err) {
      console.error("PATCH error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>{editingId ? "Edit Item (PUT)" : "Create Item"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ marginLeft: "1rem" }}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={{ marginLeft: "1rem" }}
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          {editingId ? "Update (PUT)" : "Add"}
        </button>
      </form>

      <h2>Item List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{item.name}</strong> — {item.description} — ₹{item.price}
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                marginLeft: "1rem",
                color: "white",
                background: "red",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
            <button
              onClick={() => handleEdit(item)}
              style={{
                marginLeft: "0.5rem",
                color: "white",
                background: "blue",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Edit (PUT)
            </button>
            <button
              onClick={() => handlePatchPrice(item.id)}
              style={{
                marginLeft: "0.5rem",
                color: "white",
                background: "green",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Patch Price
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
