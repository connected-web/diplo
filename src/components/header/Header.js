import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import logo from './diplo.png';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="Header-root">
        <img src={logo} className="Header-logo" alt="logo" />
        <h1 className="Header-title">Diplo - An asset rendering pipeline</h1>

        <Link className="Header-link" to="/">Home</Link>
        <Link className="Header-link" to="/objects">Objects</Link>
        <Link className="Header-link" to="/templates">Templates</Link>
        <Link className="Header-link" to="/assets">Asset Viewer</Link>
        <Link className="Header-link" to="/about">About</Link>
      </header>
    );
  }
}

export default Header;
