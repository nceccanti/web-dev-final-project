import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route } from "react-router-dom";
import React, {Component} from 'react';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import PlantList from "./components/plant-list.component.js";
import AddPlant from "./components/add-plant.component";
import EditPlant from "./components/edit-plant.componet";
import DeletePlant from "./components/delete-plant.component";
import Login from "./components/login.component";
import SignUp from "./components/sign-up.component";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {currentUser:null, plants:null};

    this.onUserAuthenticated = this.onUserAuthenticated.bind(this);
    this.logout = this.logout.bind(this);
    this.addPlantToPlantList = this.addPlantToPlantList.bind(this);
    this.deletePlantFromList = this.deletePlantFromList.bind(this);
    this.updatePlantInList = this.updatePlantInList.bind(this);
  }

  logout() {
    if (this.state.currentUser != null) {
      sessionStorage.removeItem('currentUser');
      this.setState({currentUser:null});
      this.setState({plants:null});
    }
  }

  onUserAuthenticated(user) {
    console.log("User authenticated");
    sessionStorage.setItem("currentUser", user.token);
    this.setState({currentUser:user._id});
    this.setState({plants:user.plants});
  }

  addPlantToPlantList(plant) {
    var joined = this.state.plants.concat(plant);
    this.setState({ plants: joined })
  }

  deletePlantFromList(plant) {
    let index;
    let plantsCopy = [...this.state.plants];
    let plants = this.state.plants;

    for(var i=0; i < plants.length; i++) {
      if(plantsCopy[i].plantname===plant.plantname){index = i; break;}
    }

    if (index) {
      plantsCopy.splice(index, 1);
      this.setState({plants: plantsCopy});
    }
  }

  updatePlantInList(plant) {
    let index;
    let plantsCopy = [...this.state.plants];
    let plants = this.state.plants;

    for(var i=0; i < plants.length; i++) {
      if(plantsCopy[i].plantname===plant.oldplantname){index = i; break;}
    }
    delete plant.oldplantname;
    if (index) {
      plantsCopy.splice(index, 1, plant);
      this.setState({plants: plantsCopy});
    }
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
          <Route path="/dashboard" render={(props) => (<PlantList {...props} currentUser={this.state.currentUser} plants={this.state.plants}/>)} />
          <Route path="/addplant" render={(props) => (<AddPlant {...props} currentUser={this.state.currentUser} addPlantToPlantList={this.addPlantToPlantList}/>)} />
          <Route path="/deleteplant" render={(props) => (<DeletePlant {...props} currentUser={this.state.currentUser} plants={this.state.plants}
          deletePlantFromList={this.deletePlantFromList}/>)} />
          <Route path="/editplant" render={(props) => (<EditPlant {...props} currentUser={this.state.currentUser} plants={this.state.plants}
          updatePlantInList={this.updatePlantInList}/>)} />
          <Route path="/login" render={(props) => (<Login {...props} onUserAuthenticated={this.onUserAuthenticated}/>)} />
          <Route path="/signup" render={(props) => (<SignUp {...props} />)} />
        </div>
      </Router>
    )
  }
}