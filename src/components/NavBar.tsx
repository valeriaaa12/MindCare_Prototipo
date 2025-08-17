import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mindcare-navbar sticky-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <span className="logo-badge d-inline-flex align-items-center justify-content-center">
            <i className="bi bi-activity"></i>
          </span>
          <span className="fw-semibold">MindCare</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mcNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mcNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#">ChatBot</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Our Services</a></li>
            <li className="nav-item me-lg-3"><a className="nav-link" href="#">About Us</a></li>
            <li className="nav-item"><span className="avatar-circle" title="Profile"></span></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
