import React from "react";
import { Facebook, Instagram, Twitter, YouTube, Email } from "@mui/icons-material";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1a1a1a",
        color: "#fff",
        padding: "40px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Brand / About */}
        <div style={{ flex: "1 1 250px" }}>
          <h2 style={{ marginBottom: "10px" }}>🍔 Foodeli</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
            Delicious food delivered to your doorstep. Fresh, fast, and made
            with love. Order now and enjoy the taste of happiness!
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: "1 1 150px" }}>
          <h3 style={{ marginBottom: "10px" }}>Quick Links</h3>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
            <li><a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a></li>
            <li><a href="/dishes" style={{ color: "#fff", textDecoration: "none" }}>Dishes</a></li>
            <li><a href="/cart" style={{ color: "#fff", textDecoration: "none" }}>Cart</a></li>
            <li><a href="/contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ flex: "1 1 200px" }}>
          <h3 style={{ marginBottom: "10px" }}>Contact</h3>
          <p style={{ fontSize: "14px" }}>📍 Colombo, Sri Lanka</p>
          <p style={{ fontSize: "14px" }}>📞 +94 77 123 4567</p>
          <p style={{ fontSize: "14px" }}>
            <Email sx={{ fontSize: "16px", marginRight: "5px" }} />
            support@foodeli.com
          </p>
        </div>

        {/* Socials */}
        <div style={{ flex: "1 1 150px" }}>
          <h3 style={{ marginBottom: "10px" }}>Follow Us</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="#" style={{ color: "#fff" }}>
              <Facebook />
            </a>
            <a href="#" style={{ color: "#fff" }}>
              <Instagram />
            </a>
            <a href="#" style={{ color: "#fff" }}>
              <Twitter />
            </a>
            <a href="#" style={{ color: "#fff" }}>
              <YouTube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid #444",
          marginTop: "30px",
          paddingTop: "15px",
          textAlign: "center",
          fontSize: "13px",
          color: "#aaa",
        }}
      >
        © {new Date().getFullYear()} Foodeli. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
