import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../index.css';

export default class AddPlant extends Component {
    constructor(props) {
        super(props)
        this.state = {currentUser:this.props.currentUser,
            plantname:"",
            daystowater:"",
            planttype:null
        };

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
        // if (res.status === 201) {
        //     this.onMessageChange("Account created");
        // }
        // else if (res.status === 500) {
        //     this.onMessageChange("Could not create account");
        // }
        let now = new Date();
        let nowString = now.toString();
        this.props.addPlantToPlantList({plantname: this.state.plantname,daystowater:this.state.daystowater,dateCreated:nowString,planttype:this.state.planttype});
        this.props.history.push(`/dashboard`);
    }


    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        let rqst ={plants:[{plantname: this.state.plantname,daystowater:this.state.daystowater,planttype:this.state.planttype}]};
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5005/users/addplant/'+this.state.currentUser._id, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const plantname = this.state.email;
        const daystowater = this.state.daystowater;

        return (
            <div className="login-container">
                <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <div className="form-group"> 
                        <label><h2>Plant Name: </h2></label>
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
                    <div className="padded-div-top-btm">
                        <div className="form-group"> 
                            <label><h2>Days Between Waterings: </h2></label>
                            <input type="number"
                                required
                                className="form-control"    
                                onChange={this.onDaysToWaterChange}
                                value={daystowater}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Add Plant" className="btn btn-primary btn-block" />
                    </div>
                </form>
            </div>
        )
    }
}