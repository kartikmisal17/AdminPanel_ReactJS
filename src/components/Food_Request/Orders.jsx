import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbaar from "../Navbaar/Navbaar";
import * as XLSX from "xlsx";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [stats, setStats] = useState({
    totalmenus: 0,
    totalcategories: 0,
    totalquantities: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [cottages, setCottages] = useState([]);
  const [selectedCottage, setSelectedCottage] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchCottages();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:2025/getorders");
      setOrders(response.data.orders || []);
      setAllOrders(response.data.orders || []);
      toast.success("Orders fetched successfully", { toastId: "fetch-orders-success" });
    } catch (error) {
      toast.error("Failed to fetch orders", { toastId: "fetch-orders-error" });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:2025/stats");
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch stats", { toastId: "fetch-stats-error" });
    }
  };

  const fetchCottages = async () => {
    try {
      const response = await axios.get("http://localhost:2025/getcottages");
      setCottages(response.data.cottages || []);
    } catch (error) {
      toast.error("Failed to fetch cottages");
    }
  };

  const fetchOrdersByCottage = async (cottageId) => {
    try {
      const response = await axios.get(`http://localhost:2025/getordersbycottage/${cottageId}`);
      setOrders(response.data.orders || []);
      setSelectedCottage(cottageId);
    } catch (error) {
      toast.error("Failed to fetch orders by cottage");
    }
  };

  const resetCottageFilter = () => {
    setOrders(allOrders);
    setSelectedCottage("");
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:2025/deleteorder/${id}`);
      toast.success("Order deleted successfully", { toastId: `delete-${id}` });
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order", { toastId: `delete-error-${id}` });
    }
  };

  const exportToExcel = () => {
    const data = orders.map((order) => {
      const total = order.items.reduce((sum, item) => sum + item.menu_price * item.quantity, 0);
      return {
        Name: order.name,
        Contact: order.contact,
        Cottage: order.cottage_name,
        Date: order.order_date,
        Time: order.order_time,
        Total: total,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_summary.xlsx");
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
      return sum + orderTotal;
    }, 0);
  };

  const calculateTodaysRevenue = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    return orders
      .filter((order) => formatDate(order.order_date) === todayStr)
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
        return sum + orderTotal;
      }, 0);
  };

  const calculateWeeklyRevenue = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    return orders
      .filter((order) => new Date(order.order_date) >= startOfWeek)
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
        return sum + orderTotal;
      }, 0);
  };

  const calculateMonthlyRevenue = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return orders
      .filter((order) => new Date(order.order_date) >= startOfMonth)
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
        return sum + orderTotal;
      }, 0);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const printBill = () => {
    const selectedCustomerOrders = orders.filter((order) =>
      selectedOrders.includes(order.order_id)
    );

    const totalAmount = selectedCustomerOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.menu_price * item.quantity, 0);
    }, 0);

    const upiId = "9130357742@ybl";
    const upiLink = `upi://pay?pa=${upiId}&pn=Royal Bee Retreat&am=${totalAmount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=200x200`;

    const cottageName = selectedCustomerOrders[0]?.cottage_name || "No Cottage";

    const htmlContent = `
      <html>
      <head>
        <style>
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              width: 80mm;
              margin: 0 auto;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 11px;
              line-height: 1.3;
            }
              h1{
              font-size:18px;
              text-align: center;
              margin: 0;
              }
            h2, h3 {
              text-align: center;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
            }
            th, td {
              padding: 2px 0;
              border-bottom: 1px dashed #000;
              font-size: 11px;
            }
            .qr-container {
              margin-top: 10px;
              text-align: center;
            }
            .qr-container img {
              width: 80px;
              height: 80px;
            }
            .total-row td {
              font-weight: bold;
              border-top: 1px solid #000;
            }
            hr {
              border: none;
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
            p {
              margin: 2px 0;
            }
          }
        </style>
      </head>
      <body>
        <h1>Royal Bee Retreat</h1>
        <h2>Order Summary</h2>
        <h2>🏡 ${cottageName}</h2>
        ${selectedCustomerOrders.map(order => `
          <p><strong>Date:</strong> ${formatDate(order.order_date)} | <strong>Time:</strong> ${order.order_time}</p>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.menu_name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.menu_price}</td>
                  <td>₹${item.menu_price * item.quantity}</td>
                </tr>
              `).join("")}
              <tr class="total-row">
                <td colspan="3">Order Total</td>
                <td>₹${order.items.reduce((sum, item) => sum + item.menu_price * item.quantity, 0)}</td>
              </tr>
            </tbody>
          </table>
          <hr>
        `).join("")}
        <h3>Total: ₹${totalAmount}</h3>
        <div class="qr-container">
          <h3>Scan to Pay</h3>
          <img src="${qrCodeUrl}" alt="UPI QR Code" />
          <p><em>UPI ID: ${upiId}</em></p>
          <p><strong>Amount: ₹${totalAmount}</strong></p>
          <h3>Thank You, Visit Again!</h3>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  };

  const filteredOrders = orders.filter(order => {
    const searchTerm = searchInput.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const dateObj = new Date(order.order_date);
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const isoDate = `${yyyy}-${mm}-${dd}`;
    const ddmm = `${dd}${mm}`;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mmm = monthNames[dateObj.getMonth()].toLowerCase();

    const formats = [
      `${dd}${mmm}`, `${mmm}${dd}`, `${dd} ${mmm}`, `${mmm} ${dd}`, `${ddmm}`, isoDate.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    ];

    const combinedData = `${order.name || ''}${order.contact || ''}${order.cottage_name || ''}${formats.join(' ')}`.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    return combinedData.includes(searchTerm);
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const key = order.cottage_name || "No Cottage";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div>
      <Navbaar />
      <ToastContainer />
      <br /><br />

      <h2>🗃️ Menu's Stats</h2>
      <div className="stats-cards">
        <div className="stat-card"><h4>Total Menus Available</h4><p>{stats.totalmenus}</p></div>
        <div className="stat-card"><h4>Total Food Categories</h4><p>{stats.totalcategories}</p></div>
        <div className="stat-card"><h4>Total Food Quantities</h4><p>{stats.totalquantities}</p></div>
      </div>

      <h2 className="order-title">📋 Order Management</h2>

      <div className="summary-box">
        <p>Total Orders: {orders.length}</p>
        <p>Total Revenue: ₹{calculateTotalRevenue()}</p>
        <p>Today's Revenue: ₹{calculateTodaysRevenue()}</p>
        <p>Weekly Revenue: ₹{calculateWeeklyRevenue()}</p>
        <p>Monthly Revenue: ₹{calculateMonthlyRevenue()}</p>
        <button onClick={fetchOrders}>🔄 Refresh</button>
        <button onClick={exportToExcel}>📤 Export to Excel</button>
      </div>

      <div className="search-box">
        <input type="text" value={searchInput} onChange={handleSearch} placeholder="Search by Name, Contact, Cottage or Date" />
      </div>

      <div className="cottage-filter">
        <select value={selectedCottage} onChange={(e) => fetchOrdersByCottage(e.target.value)}>
          <option value="">-- Filter by Cottage --</option>
          {cottages.map((cottage) => (
            <option key={cottage.id} value={cottage.id}>{cottage.name}</option>
          ))}
        </select>
        {selectedCottage && <button onClick={resetCottageFilter}>❌ Clear Filter</button>}
      </div>

      <button className="print-bill-btn" onClick={printBill}>
        <span className="icon">🖨️</span> Print Selected Bills
      </button>

      <table className="order-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Cottage</th>
            <th>Date</th>
            <th>Time</th>
            <th>Items Ordered</th>
            <th>Total (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedOrders).map(([cottageName, group]) => (
            <React.Fragment key={cottageName}>
              <tr>
                <td className="cottage-heading-row" colSpan="9" style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold' }}>
                  🏡 {cottageName} 
                </td>
              </tr>

              {group.map((order) => {
                const total = order.items.reduce((sum, item) => sum + item.menu_price * item.quantity, 0);
                return (
                  <tr key={order.order_id}>
                    <td><input type="checkbox" checked={selectedOrders.includes(order.order_id)} onChange={() => handleSelectOrder(order.order_id)} /></td>
                    <td>{order.name}</td>
                    <td>{order.contact}</td>
                    <td>{order.cottage_name || '-'}</td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>{order.order_time}</td>
                    <td>
                      <ul>
                        {order.items.map((item, i) => (
                          <li key={i}>{item.menu_name} × {item.quantity} @ ₹{item.menu_price}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{total}</td>
                    <td><button className="delete-btn" onClick={() => deleteOrder(order.order_id)}>❌ Delete</button></td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
