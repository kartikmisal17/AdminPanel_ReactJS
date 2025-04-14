import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbaar from "../Navbaar/Navbaar";
import * as XLSX from "xlsx"; // For exporting data to Excel
import "./Orders.css";

const Orders = () => {
  // State to hold all the orders
  const [orders, setOrders] = useState([]);
  // State to hold stats like total menus, categories, and quantities
  const [stats, setStats] = useState({
    totalmenus: 0,
    totalcategories: 0,
    totalquantities: 0,
  });
  // State to store the selected month for revenue filtering
  const [selectedMonth, setSelectedMonth] = useState("");
  // State to hold search input (name or contact)
  const [searchInput, setSearchInput] = useState("");

  // Fetch initial data for orders and stats when the component mounts
  useEffect(() => {
    fetchOrders(); // Fetch orders data
    fetchStats();  // Fetch stats data
  }, []);

  // Function to fetch orders from the backend API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:2025/getorders"); // API call to get orders
      setOrders(response.data.orders || []); // Set orders to state
      toast.success("Orders fetched successfully", { toastId: "fetch-orders-success" });
    } catch (error) {
      toast.error("Failed to fetch orders", { toastId: "fetch-orders-error" });
    }
  };

  // Function to fetch stats like total menus, categories, and quantities
  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:2025/stats"); // API call to get stats
      setStats(response.data); // Set stats to state
    } catch (error) {
      toast.error("Failed to fetch stats", { toastId: "fetch-stats-error" });
    }
  };

  // Function to delete an order by its ID
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:2025/deleteorder/${id}`); // API call to delete the order
      toast.success("Order deleted successfully", { toastId: `delete-${id}` });
      fetchOrders(); // Refresh orders after deletion
    } catch (error) {
      toast.error("Failed to delete order", { toastId: `delete-error-${id}` });
    }
  };

  // Function to export orders data to an Excel file
  const exportToExcel = () => {
    const data = orders.map((order) => {
      const total = order.items.reduce((sum, item) => sum + item.menu_price * item.quantity, 0); // Calculate total for each order
      return {
        Name: order.name,
        Contact: order.contact,
        Date: order.order_date,
        Time: order.order_time,
        Total: total, // Add total amount for each order
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data); // Create Excel sheet from JSON data
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append sheet to workbook
    XLSX.writeFile(workbook, "orders_summary.xlsx"); // Save as Excel file
  };

  // Function to calculate the total revenue from all orders
  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0); // Calculate total per order
      return sum + orderTotal; // Add up all orders' totals
    }, 0);
  };

  // Function to calculate today's revenue based on the current date
  const calculateTodaysRevenue = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    return orders
      .filter((order) => formatDate(order.order_date) === todayStr) // Filter orders by today's date
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
        return sum + orderTotal;
      }, 0);
  };

  // Function to get revenue for a specific month
  const getMonthRevenue = (month) => {
    if (!month) return 0; // If no month is selected, return 0
    return orders
      .filter((order) => {
        const date = new Date(order.order_date);
        const orderMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Get the month in YYYY-MM format
        return orderMonth === month; // Filter orders by the selected month
      })
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
        return sum + orderTotal;
      }, 0);
  };

  // Utility function to format date as YYYY-MM-DD
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Function to handle month selection for revenue filter
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value); // Update the selected month
  };

  // Function to generate a printable bill for a specific order
  const printBill = (order) => {
    const total = order.items.reduce((sum, item) => sum + item.menu_price * item.quantity, 0); // Calculate the total of the order
    const upiId = "9130357742@ybl"; // Static UPI ID for payments
    const upiLink = `upi://pay?pa=${upiId}&pn=Delicious Bites&am=${total}&cu=INR`; // UPI payment link
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=200x200`; // Generate QR code for UPI link

    // Open a new window and write the bill details in HTML format
    const billWindow = window.open("", "_blank");
    billWindow.document.write(`
      <html>
      <head>
        <title>Customer Bill</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          .qr-container { text-align: center; margin-top: 30px; }
          .qr-container img { border: 1px solid #ccc; padding: 10px; }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">Delicious Bites</h1>
        <h2>🧾 Customer Bill</h2>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Contact:</strong> ${order.contact}</p>
        <p><strong>Date:</strong> ${order.order_date}</p>
        <p><strong>Time:</strong> ${order.order_time}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
                <tr>
                  <td>${item.menu_name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.menu_price}</td>
                  <td>₹${item.menu_price * item.quantity}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <h3>Total Amount: ₹${total}</h3>

        <div class="qr-container">
          <h3>Scan to Pay via UPI</h3>
          <img src="${qrCodeUrl}" alt="UPI QR Code" />
          <p><em>UPI ID: ${upiId}</em></p>
          <p><strong>Total Amount: ₹${total}</strong></p>
          <p>Scan QR to pay ₹${total} to Delicious Bites</p>

        </div>

        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    billWindow.document.close();
  };

  // Generate a list of unique months from the orders for the dropdown
  const uniqueMonths = [
    ...new Set(
      orders.map((order) => {
        const date = new Date(order.order_date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      })
    ),
  ];

  // Filter orders based on search input (name or contact)
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      order.contact.includes(searchInput)
  );

  // Function to calculate how many orders were placed today
const calculateTodaysOrderCount = () => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  return orders.filter((order) => formatDate(order.order_date) === todayStr).length;
};


  return (
    <div className="orders-container">
      <Navbaar /> {/* Navbar component */}
      <ToastContainer /> {/* Toast notification container */}
      <br /><br />

      {/* Display Menu Stats */}
      <h2>🗃️ Menu's Stats</h2>
      <div className="stats-cards">
        <div className="stat-card"><h4>Total Menus Available</h4><p>{stats.totalmenus}</p></div>
        <div className="stat-card"><h4>Total Food Categories</h4><p>{stats.totalcategories}</p></div>
        <div className="stat-card"><h4>Total Food Quantities</h4><p>{stats.totalquantities}</p></div>
      </div>

      {/* Order Management Section */}
      <h2 className="order-title">📋 Order Management</h2>

      <div className="summary-box">
        <p>Total Orders: {filteredOrders.length}</p>
        <p>Total Revenue: ₹{calculateTotalRevenue()}</p>
        <p>Today's Revenue: ₹{calculateTodaysRevenue()}</p>
        <p>Today's Orders: {calculateTodaysOrderCount()}</p>


        <div className="month-selector">
          <label htmlFor="month">Monthwise Revenue: </label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            <option value="">-- Select Month --</option>
            {uniqueMonths.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          {selectedMonth && (
            <p>Revenue for {selectedMonth}: ₹{getMonthRevenue(selectedMonth)}</p>
          )}
        </div>

        <button onClick={fetchOrders}>🔄 Refresh</button>
        <button onClick={exportToExcel}>📤 Export to Excel</button>
      </div>

      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search Customer by Name or Contact"
        />
      </div>

      {/* Orders Table */}
      <table className="order-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Time</th>
            <th>Items Ordered</th>
            <th>Total (₹)</th>
            <th>Action</th>
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, idx) => {
            const total = order.items.reduce((sum, item) => sum + item.menu_price * item.quantity, 0); // Calculate total for each order
            return (
              <tr key={idx}>
                <td>{order.name}</td>
                <td>{order.contact}</td>
                <td>{order.order_date}</td>
                <td>{order.order_time}</td>
                <td>
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.menu_name} × {item.quantity} @ ₹{item.menu_price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{total}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteOrder(order.order_id)}>❌ Delete</button>
                </td>
                <td>
                  <button className="print-btn" onClick={() => printBill(order)}>🖨️ Print</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
