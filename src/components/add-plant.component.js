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
            planttype:null,
            plantImage:null,
            msg: ""
        };

        this.onPlantNameChange = this.onPlantNameChange.bind(this);
        this.onDaysToWaterChange = this.onDaysToWaterChange.bind(this);
        this.onPlantTypeChange = this.onPlantTypeChange.bind(this);
    }
    
    componentWillMount() {
        if(null===this.props.currentUser) {
            let sessionData=this.props.getUserDataFromSession();
            this.setState({currentUser:sessionData.user});
        }
    }

    onMessageChange(message) {
        this.setState({msg: message})
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
        if (res.status === 201) {
            let now = new Date();
            let nowString = now.toString();
            console.log(res);
            this.props.addPlantToPlantList({plantname: this.state.plantname,
                daystowater:this.state.daystowater,
                dateCreated:nowString,
                planttype:this.state.planttype,
            });
            this.props.history.push(`/dashboard`);
        }
        else if (res.status === 500) {
            this.onMessageChange("Could not create account");
        }
        this.onMessageChange(res.data)
    }

    handleSubmit(e) {
        e.preventDefault();
        let rqst ={plantname: this.state.plantname,daystowater:this.state.daystowater,planttype:this.state.planttype};
        const back = process.env.NODE_ENV === 'production' ? 'https://hydroclock.herokuapp.com/' : 'http://localhost:5005';
        axios.post(`${back}/users/addplant/`+this.state.currentUser._id, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const plantname = this.state.email;
        const daystowater = this.state.daystowater;
        const msg = this.state.msg;

        return (
            <div className="login-container">
                <p style={{color:"red"}}>{msg}</p>
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