import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import React, {Component} from 'react';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import PlantList from "./components/plant-list.component.js";
import AddPlant from "./components/add-plant.component";
import EditPlant from "./components/edit-plant.componet";
import DeletePlant from "./components/delete-plant.component";
import Login from "./components/login.component";
import SignUp from "./components/sign-up.component";
import Profile from "./components/update-profile.component";

const plantTypes = [
  { value: 0, label: 'African Violet', days: 6 },
  { value: 1, label: 'Aloe Vera', days: 16},
  { value: 2, label: 'Bamboo', days: 6},
  { value: 3, label: 'Cactus', days: 9},
  { value: 4, label: 'Croton', days: 7},
  { value: 5, label: 'Fiddle Leaf Fig', days: 10},
  { value: 6, label: 'Orchid', days: 7},
  { value: 7, label: 'Peace Lily', days: 2},
  { value: 8, label: 'Philodendron', days: 7},
  { value: 9, label: 'Sago Palm', days: 12},
  { value: 10, label: 'Thanksgiving Cactus', days: 8},
]

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {currentUser:null, plants:null};

    this.onUserAuthenticated = this.onUserAuthenticated.bind(this);
    this.logout = this.logout.bind(this);
    this.getUserDataFromSession = this.getUserDataFromSession.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.addPlantToPlantList = this.addPlantToPlantList.bind(this);
    this.deletePlantFromList = this.deletePlantFromList.bind(this);
    this.updatePlantInList = this.updatePlantInList.bind(this);

    // console.log(this.props);
  }

  logout() {
    if (this.state.currentUser != null) {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('plants');
      this.setState({currentUser:null});
      this.setState({plants:null});
    }
  }

  onUserAuthenticated(user) {
    // console.log("User authenticated");
    delete user.password;
    // console.log(JSON.stringify(user.plants));
    sessionStorage.setItem("plants", JSON.stringify(user.plants));
    this.setState({plants:user.plants});
    delete user.plants;
    this.setState({currentUser:user});
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }

  getUserDataFromSession() {
    let sessionUser = JSON.parse(sessionStorage.getItem("currentUser"));
    let sessionPlants = JSON.parse(sessionStorage.getItem("plants"));

    if (sessionUser&&sessionPlants) {
      this.setState({currentUser:sessionUser});
      this.setState({plants:sessionPlants})
    }
    else {
      <Redirect push to="/~t12r259/hydroclock/login" />
    }
    return {user:sessionUser, plants:sessionPlants};
  }

  addPlantToPlantList(plant) {
    var joined = this.state.plants.concat(plant);
    this.setState({ plants: joined })
    sessionStorage.setItem("plants", JSON.stringify(joined));
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
      sessionStorage.setItem("plants", JSON.stringify(plantsCopy));
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
      sessionStorage.setItem("plants", JSON.stringify(plantsCopy));
    }
  }

  updateUser(user) {
    // console.log(this.state);
    this.setState({currentUser: user});
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }

  render () {
    return (
      <Router>
        <div className="App">
          

          <div className="container">
            <Navbar logout={this.logout} currentUser={this.state.currentUser}/>

            <Route path="/~t12r259/hydroclock/home" component={Home} />
            <Route path="/~t12r259/hydroclock/dashboard" render={(props) => (<PlantList {...props} currentUser={this.state.currentUser} plants={this.state.plants} getUserDataFromSession={this.getUserDataFromSession}/>)} />
            <Route path="/~t12r259/hydroclock/addplant" render={(props) => (<AddPlant {...props} currentUser={this.state.currentUser} addPlantToPlantList={this.addPlantToPlantList}
            plantTypes={plantTypes} getUserDataFromSession={this.getUserDataFromSession}/>)} />
            <Route path="/~t12r259/hydroclock/deleteplant" render={(props) => (<DeletePlant {...props} currentUser={this.state.currentUser} plants={this.state.plants}
            deletePlantFromList={this.deletePlantFromList} getUserDataFromSession={this.getUserDataFromSession} plantTypes={plantTypes}/>)} />
            <Route path="/~t12r259/hydroclock/editplant" render={(props) => (<EditPlant {...props} currentUser={this.state.currentUser} plants={this.state.plants}
            updatePlantInList={this.updatePlantInList} plantTypes={plantTypes} getUserDataFromSession={this.getUserDataFromSession}/>)} />
            <Route path="/~t12r259/hydroclock/login" render={(props) => (<Login {...props} onUserAuthenticated={this.onUserAuthenticated}/>)} />
            <Route path="/~t12r259/hydroclock/signup" render={(props) => (<SignUp {...props} />)} />
            <Route path="/~t12r259/hydroclock/profile" render={(props) => (<Profile {...props} user={this.state.currentUser} updateUser={this.updateUser} getUserDataFromSession={this.getUserDataFromSession}/>)} />


            <footer className="page-footer font-small">
              <div className="footer-copyright text-center py-3">2021<br></br>Nic Ceccanti &#8226; Byron Norman &#8226; Nathan Rubino<br></br>
                <a href="https://github.com/nceccanti/web-dev-final-project"> Visit the GitHub repo used to make this website</a>
              </div>
          </footer>
          </div>


        </div>
      </Router>
    )
  }
}