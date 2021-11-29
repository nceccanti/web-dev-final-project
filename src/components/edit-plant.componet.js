import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

export default class EditPlant extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        let qName = this.props.location.search.replace("?plant=", "").replace("%20", " ");
        let plant = {plantname:"", daystowater:"", dateCreated:""};

        let plants = this.props.plants ?? [];
        for(var i=0; i < plants.length; i++) {
            if (plants[i].plantname===qName) {
                plant = plants[i];
                break;
            }
        }
        
        this.state = {currentUser:this.props.currentUser, 
            plantname:plant.plantname, 
            oldplantname:plant.plantname,
            daystowater:plant.daystowater, 
            dateCreated:plant.dateCreated};
        
        this.processResponse = this.processResponse.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onPlantNameChange = this.onPlantNameChange.bind(this);
        this.onDaysToWaterChange = this.onDaysToWaterChange.bind(this);
    }
    
    onPlantNameChange(event) {
        this.setState({plantname: event.target.value});
    }
    
    onDaysToWaterChange(event) {
        this.setState({daystowater: event.target.value});
    }

    processResponse(res) {
        this.props.updatePlantInList({plantname: this.state.plantname,daystowater:this.state.daystowater,dateCreated:this.state.dateCreated,oldplantname:this.state.oldplantname})
        this.props.history.push(`/dashboard`);
    }


    handleSubmit(e) {
        e.preventDefault();
        // console.log(this.state);
        let rqst ={plants:[{plantname: this.state.plantname}]};
        // Waiting for backend implementation
        // axios.post('http://localhost:5000/users/removeplant/'+this.state.currentUser, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.history.push(`/dashboard`);
    }
  
    render() {
        const plantname = this.state.plantname;
        const daystowater = this.state.daystowater;
        // const dateCreated = this.state.dateCreated;

        return (
            <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                <div className="form-group"> 
                    <label>Plant Name: </label>
                    <input type="text"
                        required
                        className="form-control"
                        onChange={this.onPlantNameChange}
                        value={plantname}
                    />
                </div>
                <div className="form-group"> 
                    <label>Days to water: </label>
                    <input type="number"
                        required
                        className="form-control"    
                        onChange={this.onDaysToWaterChange}
                        value={daystowater}
                    />
                </div>
                <div className="form-group">
                    <input type="submit" value="Edit Plant" className="btn btn-primary" />
                    <input onClick={this.handleCancel} value="Cancel" className="btn btn-secondary" />
                </div>
            </form>
        )
    }
}