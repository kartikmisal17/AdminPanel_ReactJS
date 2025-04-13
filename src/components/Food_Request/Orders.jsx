import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbaar from "../Navbaar/Navbaar";
import * as XLSX from "xlsx";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalmenus: 0,
    totalcategories: 0,
    totalquantities: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:2025/getorders");
      setOrders(res.data.orders || []);
      toast.success("Orders fetched", { toastId: "fetch-orders-success" });
    } catch (err) {
      toast.error("Failed to fetch orders", { toastId: "fetch-orders-error" });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:2025/stats");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to fetch stats", { toastId: "fetch-stats-error" });
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:2025/deleteorder/${id}`);
      toast.success("Order deleted", { toastId: `delete-${id}` });
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete order", { toastId: `delete-error-${id}` });
    }
  };

  const exportToExcel = () => {
    const data = orders.map((o) => ({
      Name: o.name,
      Contact: o.contact,
      Date: o.order_date,
      Time: o.order_time,
      Total: o.items.reduce((acc, i) => acc + i.menu_price * i.quantity, 0),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_summary.xlsx");
  };

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((iSum, i) => iSum + i.menu_price * i.quantity, 0),
    0
  );

  const formatDateToYYYYMMDD = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const todaysRevenue = orders
    .filter((order) => formatDateToYYYYMMDD(order.order_date) === todayStr)
    .reduce(
      (sum, order) =>
        sum +
        order.items.reduce((iSum, i) => iSum + i.menu_price * i.quantity, 0),
      0
    );

  return (
    <div className="orders-container">
      <Navbaar />
      <ToastContainer />
      <br /><br />

      <h2>🗃️ Menu's Stats</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Menus Available</h4>
          <p>{stats.totalmenus}</p>
        </div>
        <div className="stat-card">
          <h4>Total Food Categories</h4>
          <p>{stats.totalcategories}</p>
        </div>
        <div className="stat-card">
          <h4>Total Food Quantities</h4>
          <p>{stats.totalquantities}</p>
        </div>
      </div>

      <h2 className="order-title">📋 Order Management</h2>

      <div className="summary-box">
        <p>Total Orders: {orders.length}</p>
        <p>Total Revenue: ₹{totalRevenue}</p>
        <p>Today's Revenue: ₹{todaysRevenue}</p>
        <button onClick={fetchOrders}>🔄 Refresh</button>
        <button onClick={exportToExcel}>📤 Export to Excel</button>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Time</th>
            <th>Items Order</th>
            <th>Total (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={idx}>
              <td>{o.name}</td>
              <td>{o.contact}</td>
              <td>{o.order_date}</td>
              <td>{o.order_time}</td>
              <td>
                <ul>
                  {o.items.map((item, i) => (
                    <li key={i}>
                      {item.menu_name} × {item.quantity} @ ₹{item.menu_price}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                {o.items.reduce(
                  (sum, i) => sum + i.menu_price * i.quantity,
                  0
                )}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteOrder(o.order_id)}
                >
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
