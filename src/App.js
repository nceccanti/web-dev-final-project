import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route } from "react-router-dom";
import React, {Component} from 'react';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import PlantList from "./components/plant-list.component.js";
import AddPlant from "./components/add-plant.component";
import Login from "./components/login.component";
import SignUp from "./components/sign-up.component";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {currentUser:null};

    this.onUserAuthenticated = this.onUserAuthenticated.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    if (this.state.currentUser != null) {
      sessionStorage.removeItem('currentUser');
      this.setState({currentUser:null});
    }
  }

  onUserAuthenticated(user) {
    console.log("User authenticated");
    sessionStorage.setItem("currentUser", user);
    this.setState({currentUser:user});
  }

  render () {
    const currentUser = this.state.currentUser;
    let p
    if (currentUser) {
      p = <p>Authenticated</p>;
    }
    else {
      p = <p>Not Authenticated</p>;
    }
    return (
      <Router>
        <div className="App">
          <Navbar logout={this.logout} currentUser={this.state.currentUser}/>
          {p}
          <Route path="/home" component={Home} />
          <Route path="/dashboard" component={PlantList} />
          <Route path="/addplant" component={AddPlant} />
          <Route path="/login" render={(props) => (<Login {...props} onUserAuthenticated={this.onUserAuthenticated}/>)} />
          <Route path="/signup" render={(props) => (<SignUp {...props} />)} />
        </div>
      </Router>
    )
  }
}