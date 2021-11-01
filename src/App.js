import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import PlantList from "./components/plant-list.component.js";
import AddPlant from "./components/add-plant.component";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Route path="/home" component={Home} />
        <Route path="/dashboard" component={PlantList} />
        <Route path="/addplant" component={AddPlant} />
      </div>
    </Router>
  );
}

export default App;
