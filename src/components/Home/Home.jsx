import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Navbaar from "../Navbaar/Navbaar";

import './Home.css';

export default function Home() {
  return (
    <>
      <Navbaar />

      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <Image src="pexels-chanwalrus-958545.jpg" className="hero-image" fluid />
          <div className="hero-text">
            <h1>
              Welcome to <span>Delicious Bites</span>
            </h1>
            <p>Experience exquisite dining with an unforgettable ambiance.</p>
            <Button className="explore-btn">View Menu</Button>
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2>Who We Are</h2>
          <p>
            At <b>Delicious Bites</b>, we bring you a world of flavors crafted by expert chefs. Enjoy a delightful experience with our handpicked ingredients and signature dishes that will tantalize your taste buds.
          </p>
        </div>

        {/* Reservation Section */}
        <div className="reservation-section">
          <h2>Make a Reservation</h2>
          <p>Book a table for a memorable dining experience. Enjoy great food, amazing ambiance, and top-class service.</p>
          <Button className="reserve-btn">Book Now</Button>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <h2>Contact Us</h2>
          <p><b>📍 Location:</b> 123 Food Street, Culinary City</p>
          <p><b>📞 Phone:</b> +1 234 567 890</p>
          <p><b>📧 Email:</b> contact@deliciousbites.com</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="menu-footer text-center bg-dark text-light py-3">
        <p>&copy; 2024 Delicious Bites | All Rights Reserved</p>
      </footer>
    </>
  );
}
