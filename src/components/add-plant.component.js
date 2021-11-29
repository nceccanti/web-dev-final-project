import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

export default class AddPlant extends Component {
    constructor(props) {
        super(props)
        this.state = {currentUser:this.props.currentUser, plantname:"", daystowater:""};

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
        // if (res.status === 201) {
        //     this.onMessageChange("Account created");
        // }
        // else if (res.status === 500) {
        //     this.onMessageChange("Could not create account");
        // }
        let now = new Date();
        this.props.addPlantToPlantList({plantname: this.state.plantname,daystowater:this.state.daystowater,dateCreated:now});
        this.props.history.push(`/dashboard`);
    }


    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        let rqst ={plants:[{plantname: this.state.plantname,daystowater:this.state.daystowater}]};
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5000/users/addplant/'+this.state.currentUser, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const plantname = this.state.email;
        const daystowater = this.state.daystowater;

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
                    <input type="submit" value="Add Plant" className="btn btn-primary" />
                </div>
            </form>
        )
    }
}