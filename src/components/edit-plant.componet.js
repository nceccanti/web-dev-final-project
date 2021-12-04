import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../index.css';

export default class EditPlant extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props);
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
            planttype:plant.planttype,
            message: ""
        };
        
        this.processResponse = this.processResponse.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onPlantNameChange = this.onPlantNameChange.bind(this);
        this.onDaysToWaterChange = this.onDaysToWaterChange.bind(this);
        this.onPlantTypeChange = this.onPlantTypeChange.bind(this);
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
            this.setState({currentUser:sessionData.user});
            this.setState({plantname:plant.plantname});
            this.setState({oldplantname:plant.plantname});
            this.setState({daystowater:plant.daystowater});
            this.setState({dateCreated:plant.dateCreated});
            this.setState({planttype:plant.planttype});
        }
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
        if(res.status === 201) {
            this.props.updatePlantInList({plantname: this.state.plantname,daystowater:this.state.daystowater,dateCreated:this.state.dateCreated,oldplantname:this.state.oldplantname,planttype:this.state.planttype})
            this.props.history.push(`/~t12r259/hydroclock/dashboard`);
        }
        this.setState({message: res.data.message})
    }


    handleSubmit(e) {
        e.preventDefault();
        // console.log(this.state);
        let rqst ={plantname: this.state.plantname,daystowater:this.state.daystowater,oldplantname:this.state.oldplantname,planttype:this.state.planttype};
        axios.post(`https://csci331-backend.herokuapp.com/users/updateplant/`+this.state.currentUser._id, rqst).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.history.push(`/~t12r259/hydroclock/dashboard`);
    }
  
    render() {
        const plantname = this.state.plantname;
        const daystowater = this.state.daystowater;
        // const dateCreated = this.state.dateCreated;
        const msg = this.state.message;

        return (
            <div className="login-container">
                <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <div className="form-group"> 
                        <p style={{color:"red"}}>{msg}</p>
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
                    <div className="form-group"> 
                        <label><h2>Days to water: </h2></label>
                        <input type="number"
                            required
                            className="form-control"    
                            onChange={this.onDaysToWaterChange}
                            value={daystowater}
                        />
                    </div>
                    <div className="form-group center-block">
                        <div className="col-md-12 text-center padded-div-top-btm">
                            <input type="submit" value="Edit Plant" className="btn btn-primary btn-lg"/>
                            <input onClick={this.handleCancel} value="Cancel" className="btn btn-secondary btn-lg" />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}