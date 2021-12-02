import React, {Component} from 'react';
import Select from 'react-select';
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
            dateCreated:plant.dateCreated,
            planttype:plant.planttype
        };
        
        this.processResponse = this.processResponse.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onPlantNameChange = this.onPlantNameChange.bind(this);
        this.onDaysToWaterChange = this.onDaysToWaterChange.bind(this);
        this.onPlantTypeChange = this.onPlantTypeChange.bind(this);
    }
    
    onPlantNameChange(event) {
        this.setState({plantname: event.target.value});
    }
    
    onDaysToWaterChange(event) {
        this.setState({daystowater: event.target.value});
    }

    onPlantTypeChange(event) {
        if (event){
            this.setState({planttype: event.value});
            this.setState({daystowater: event.days});
        }
        else {
            this.setState({planttype:""});
            this.setState({daystowater: ""});
        }
    }

    processResponse(res) {
        this.props.updatePlantInList({plantname: this.state.plantname,daystowater:this.state.daystowater,dateCreated:this.state.dateCreated,oldplantname:this.state.oldplantname,planttype:this.state.planttype})
        this.props.history.push(`/dashboard`);
    }


    handleSubmit(e) {
        e.preventDefault();
        // console.log(this.state);
        let rqst ={plants:[{plantname: this.state.plantname,daystowater:this.state.daystowater,oldplantname:this.state.oldplantname,planttype:this.state.planttype}]};
        // Waiting for backend implementation
        axios.post('http://localhost:5005/users/updateplant/'+this.state.currentUser._id, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
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
                <div className="padded-div-top-btm">
                    <label><h2>Plant Types: </h2>(Selection will autofill watering schedule field)</label>
                    <Select options={this.props.plantTypes} isSearchable={true} isClearable={true} onChange={this.onPlantTypeChange} value={this.props.plantTypes[this.state.planttype]}/>
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