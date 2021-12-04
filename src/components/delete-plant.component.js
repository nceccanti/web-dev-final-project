import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

export default class DeletePlant extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        let qName = this.props.location.search.replace("?plant=", "").replace("%20", " ");
        let plant = {plantname:"", daystowater:"", planttype:"", dateCreated:""};

        let plants = this.props.plants ?? [];
        for(var i=0; i < plants.length; i++) {
            if (plants[i].plantname===qName) {
                plant = plants[i];
                break;
            }
        }
        
        let plantTypeString = "";
        if(plant.planttype){plantTypeString= this.props.plantTypes[plant.planttype].label;}

        this.state = {currentUser:this.props.currentUser, 
            plantname:plant.plantname, 
            daystowater:plant.daystowater, 
            planttype:plantTypeString,
            dateCreated:plant.dateCreated,
        };
        
        this.processResponse = this.processResponse.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        if(null===this.props.currentUser) {
            let sessionData=this.props.getUserDataFromSession();
            let plants = sessionData.plants;
            let qName = this.props.location.search.replace("?plant=", "").replace("%20", " ");
            let plant = {plantname:"", daystowater:"", dateCreated:""};

            for(var i=0; i < plants.length; i++) {
                if (plants[i].plantname===qName) {
                    plant = plants[i];
                    break;
                }
            }

            let plantTypeString = "";
            if(plant.planttype){plantTypeString= this.props.plantTypes[plant.planttype].label;}

            this.setState({currentUser:sessionData.user});
            this.setState({plantname:plant.plantname});
            this.setState({daystowater:plant.daystowater});
            this.setState({dateCreated:plant.dateCreated});
            this.setState({planttype:plantTypeString});
        }
    }
    
    processResponse(res) {
        this.props.deletePlantFromList({plantname: this.state.plantname,daystowater:this.state.daystowater,dateCreated:this.state.dateCreated})
        this.props.history.push(`/dashboard`);
    }


    handleConfirm(e) {
        e.preventDefault();
        // console.log(this.state);
        let rqst ={plants:[{plantname: this.state.plantname}]};
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5005/users/removeplant/'+this.state.currentUser._id, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.history.push(`/dashboard`);
    }
  
    render() {
        const plantname = this.state.plantname;
        const planttype = this.state.planttype;
        const daystowater = this.state.daystowater;
        const dateCreated = this.state.dateCreated;

        return (
            <div>
                <h3>Are you sure you want to delete this plant?</h3>
                <p>Plant Name: {plantname}</p>
                <p>Plant Type: {planttype}</p>
                <p>Days til next water: {daystowater}</p>
                <p>Date created: {dateCreated}</p>
                <button onClick={this.handleConfirm} className="btn btn-warning">Confirm</button>
                <button onClick={this.handleCancel} className="btn btn-secondary">Cancel</button>
            </div>
        )
    }
}