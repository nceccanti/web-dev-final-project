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
        // this.onPlantImageChanged = this.onPlantImageChanged(this);
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

    // onPlantImageChanged(event) {
    //     // console.log(this.state);
    //     console.log(event);
    //     if(event.target) {
    //         this.setState({plantImage:event.target.files[0]});
    //     }
    // }

    onPlantImageChanged = (event) => {this.setState({plantImage:event.target.files[0]});}

    onMessageChange(message) {
        this.setState({msg: message})
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
        this.onMessageChange(res.data.message)
    }


    handleSubmit(e) {
        e.preventDefault();
        
        var bodyFormData = new FormData();

        bodyFormData.append('plantImage', this.state.plantImage, this.state.plantImage.name);
        bodyFormData.append('plantname', this.state.plantname);
        bodyFormData.append('planttype', this.state.planttype);
        bodyFormData.append('daystowater', this.state.daystowater);


        console.log(bodyFormData);
        // let rqst ={plantname: this.state.plantname,
        //         daystowater:this.state.daystowater,
        //         planttype:this.state.planttype,
        //         plantImage:this.state.plantImage
        //     };
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5005/users/addplant/'+this.state.currentUser._id, bodyFormData).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
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
                    <div className="padded-div-top-btm">
                        <div className="form-group"> 
                            <label><h2>Image of plant: </h2></label>
                            <input type="file"
                                className="form-control"    
                                onChange={this.onPlantImageChanged}
                                name="plantImage"
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