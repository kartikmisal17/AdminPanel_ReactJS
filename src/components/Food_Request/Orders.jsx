// Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbaar from "../Navbaar/Navbaar";
import * as XLSX from "xlsx";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://192.168.104.169:2025/getorders");
      setOrders(res.data.orders || []);
      toast.success("Orders fetched");
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://192.168.104.169:2025/deleteorder/${id}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete order");
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

  // Helper to format ISO string to local YYYY-MM-DD
  const formatDateToYYYYMMDD = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Today's date string
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
      <h2>📋 Order Management</h2>
      <div className="summary-box">
        <p>Total Orders: {orders.length}</p>
        <p>Total Revenue: ₹{totalRevenue}</p>
        <p>Today's Revenue: ₹{todaysRevenue}</p>
        <button onClick={fetchOrders}>🔄 Refresh</button>
        <button onClick={exportToExcel}>📤 Export to Excel</button>
      </div>
      <ul className="order-list">
        {orders.map((o, idx) => (
          <li key={idx} className="order-item">
            <strong>{o.name}</strong> - {o.contact}
            <br />
            Date: {o.order_date} | Time: {o.order_time}
            <br />
            <strong>
              Total: ₹
              {o.items.reduce(
                (sum, i) => sum + i.menu_price * i.quantity,
                0
              )}
            </strong>
            <ul>
              {o.items.map((item, i) => (
                <li key={i}>
                  {item.menu_name} × {item.quantity} @ ₹{item.menu_price}
                </li>
              ))}
            </ul>
            <button
              className="delete-btn"
              onClick={() => deleteOrder(o.order_id)}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
