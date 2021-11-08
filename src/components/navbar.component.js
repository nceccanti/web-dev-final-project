import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../img/logo.svg';
import '../index.css';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/home" className="logo"><LogoSvg /></Link>
        <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="navbar-item">
          <Link to="/addplant" className="nav-link">Add Plant</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}