import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../img/logo-leaf.svg';
import '../index.css';

export default class Navbar extends Component {

render() {
  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div class="container-fluid">
      <Link to="/home" className="logo navbar-header"><LogoSvg /></Link>
      {this.props.currentUser 
      ? <div className="navbar-nav">
        <ul class="nav navbar-nav">
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/home" onClick={this.props.logout} className="nav-link">Logout</Link></li>
        </ul>
        </div>
      : <div className="navbar-nav">
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          </ul>
        </div>
      }
      </div>
    </nav>
  );
}
}