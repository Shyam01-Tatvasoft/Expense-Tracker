import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Category = { id: number; name: string };
type Expense = {
  id: number;
  description: string;
  amount: string; // Prisma Decimal arrives as a string
  category: Category;
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [catName, setCatName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function load() {
    const [c, e] = await Promise.all([
      fetch(`${API}/api/categories`).then((r) => r.json()),
      fetch(`${API}/api/expenses`).then((r) => r.json()),
    ]);
    setCategories(c);
    setExpenses(e);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCategory() {
    if (!catName.trim()) return;
    await fetch(`${API}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName }),
    });
    setCatName("");
    load();
  }

  async function addExpense() {
    if (!desc || !amount || !categoryId) return;
    await fetch(`${API}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc, amount: Number(amount), categoryId: Number(categoryId) }),
    });
    setDesc("");
    setAmount("");
    load();
  }

  async function removeExpense(id: number) {
    await fetch(`${API}/api/expenses/${id}`, { method: "DELETE" });
    load();
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Expense Tracker</h1>

      <h3>Add category</h3>
      <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Food" />
      <button onClick={addCategory}>Add</button>

      <h3>Add expense</h3>
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Category...</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button onClick={addExpense}>Add</button>

      <h3>Expenses (total: {total.toFixed(2)})</h3>
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.description} - {e.amount} [{e.category.name}]{" "}
            <button onClick={() => removeExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}