import Navbaar from "../Navbaar/Navbaar";
import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import "./Menucrd.css"



const Menucrd = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    axios
=======
    axios   
>>>>>>> 8984db7 (Updated)
      .get("http://localhost:2025/menucard")
      .then((response) => {
        let sortedMenu = response.data.menu.sort((a, b) =>
          a.food_category.localeCompare(b.food_category)
        );
<<<<<<< HEAD
        setMenuItems(sortedMenu);
=======
        setMenuItems(sortedMenu); 
>>>>>>> 8984db7 (Updated)
      })
      .catch((error) => console.error("Error fetching menu:", error));
  }, []);

  return (
    <div>
      <Navbaar />
<<<<<<< HEAD
      <header className="text-center bg-dark text-light py-4">
=======
      
      <header className="menu-header">
>>>>>>> 8984db7 (Updated)
        <h1 className="fw-bold display-3">Delicious Bites</h1>
        <p className="lead">Savor the Flavor, Enjoy the Moment</p>
      </header>

      <section className="container py-5">
        <div className="row">
          {menuItems.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card menu-card shadow-lg">
                <div className="card-body">
                  <h5 className="card-title text-primary">{item.menu_name}</h5>
                  <p className="text-muted">Category: <strong>{item.food_category}</strong></p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p className="fw-bold text-danger">₹{item.menu_price}</p>
                  <button className="btn btn-warning">
                    <i className="fas fa-shopping-cart"></i> Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

<<<<<<< HEAD
      <footer className="text-center bg-dark text-light py-3">
=======
      <footer className="menu-footer">
>>>>>>> 8984db7 (Updated)
        <p>&copy; 2024 Delicious Bites | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Menucrd;
