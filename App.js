import React, { useEffect, useState } from "react";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [perPage, setPerPage] = useState(() =>
    parseInt(localStorage.getItem("perPage")) || 10
  );
  const [currentPage, setCurrentPage] = useState(1);

  const fetchExpenses = async () => {
    const res = await fetch(
      `http://localhost:3001/api/expenses?page=${currentPage}&limit=${perPage}`
    );
    const data = await res.json();
    setExpenses(data.expenses);
    setTotalExpenses(data.total);
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, perPage]);

  const handlePerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    localStorage.setItem("perPage", newLimit);
    setPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/expenses/${id}`, {
      method: "DELETE",
    });
    const remainingItems = expenses.length - 1;
    const totalPages = Math.ceil((totalExpenses - 1) / perPage);
    if (remainingItems === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else {
      fetchExpenses();
    }
  };

  const totalPages = Math.ceil(totalExpenses / perPage);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dynamic Pagination</h2>

      <label>
        Show&nbsp;
        <select value={perPage} onChange={handlePerPageChange}>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={40}>40</option>
        </select>
        &nbsp;per page
      </label>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - ₹{expense.amount}{" "}
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            disabled={currentPage === i + 1}
            style={{ marginRight: "5px" }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
