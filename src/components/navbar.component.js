import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../img/logo-leaf.svg';
import '../index.css';

export default class Navbar extends Component {

render() {
  return (
    <nav className="navbar  navbar-expand-lg">
      <div className="container-fluid">
      <Link to="/home" className="logo navbar-header"><LogoSvg /></Link>
      {this.props.currentUser 
      ? <div className="navbar-nav">
        <ul className="nav navbar-nav">
          <li><Link to="/dashboard" className="nav-link btn-lg">Dashboard</Link></li>
          <li><Link to="/profile" className="nav-link btn-lg ms-3">Edit Profile</Link></li>
          <li><Link to="/home" onClick={this.props.logout} className="nav-link btn-lg ms-3">Logout</Link></li>
        </ul>
        </div>
      : <div className="navbar-nav">
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item btn-lg" id="loginButton">
              <Link to="/login" className="nav-link"><h2>Login</h2></Link>
            </li>
          </ul>
        </div>
      }
      </div>
    </nav>
  );
}
}