import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

export default class EditUser extends Component {
    constructor(props) {
        super(props)

        let user = this.props.user;
        if(null===this.props.user) {
            let sessionData=this.props.getUserDataFromSession();
            user = sessionData.user;
        }
        // console.log(this.props);

        this.state = {
            username:user.username,
            _id:user._id,
            email:user.email, 
            phone:user.phone,
            notifyTime:user.notifyTime,
            isEmail:user.isEmail,
            isSMS:user.isSMS,
            msg: "",
            displayTime: "",
        }

        let nTime = "12:00";
        if(this.state.notifyTime) {
            nTime = this.state.notifyTime;
        }

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onIsEmailChange = this.onIsEmailChange.bind(this);
        this.onNotifyTimeChange = this.onNotifyTimeChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onIsSMSChange = this.onIsSMSChange.bind(this);
        this.setState({displayTime: this.convertDisplay(this.state.notifyTime)})
    }

    componentWillMount() {
        if(null===this.props.user) {
            let sessionData=this.props.getUserDataFromSession();
            let user = sessionData.user;
            let nTime = "12:00";
            if(user.notifyTime) {
                nTime = user.notifyTime;
            }
            else {
                user.notifyTime = "";
            }
            this.setState({plants:sessionData.plants});
            this.setState({username:user.username});
            this.setState({_id:user._id});
            this.setState({email:user.email});
            this.setState({phone:user.phone});
            this.setState({notifyTime:user.notifyTime});
            this.setState({isEmail:user.isEmail});
            this.setState({isSMS:user.isSMS});
            this.setState({displayTime: this.convertDisplay(nTime)})
        }
    }

    onUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    onEmailChange(event) {
        this.setState({email: event.target.value});
    }
    
    onPhoneChange(event) {
        this.setState({phone: event.target.value});
    }

    onIsEmailChange(event) {
        this.setState({isEmail: event.target.checked});
    }

    onNotifyTimeChange(event) {
        let now = new Date()
        let h = event.target.value.substring(0,2)
        let m = event.target.value.substring(3,5)
        h = parseInt(h);
        m = parseInt(m)
        let local = new Date(now.getFullYear(), now.getMonth(), now.getDay(), h, m)
        let utc = "" + local.getUTCHours() + ":" + local.getUTCMinutes()
        this.convertDisplay(utc)
        this.setState({notifyTime:utc})
    }

    convertDisplay(time) {
        let utc = time.split(/[.,\/ :]/)
        let h = utc[0];
        let m = utc[1];
        if(h.length == 1) {
            h = "0" + h
        }
        if(m.length == 1) {
            m = "0" + m
        }
        let comp = h + ":" + m;
        this.setState({displayTime:comp})
    }

    onIsSMSChange(event) {
        this.setState({isSMS: event.target.checked});
    }

    onMessageChange(message) {
        this.setState({msg: message})
    }
    
    processResponse(res) {
        if (res.status === 201) {
            this.props.updateUser(this.state);
            this.props.history.push(`/dashboard`);
        }
        else if (res.status === 500) {
            this.onMessageChange("Could not update account");
        } else {
            this.onMessageChange(res.data.message);
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        // console.log(this.state);
        // CONNECT TO BACKEND ENDPOINT HERE
        console.log(this.state)
        axios.post('http://localhost:5005/users/update/'+this.props.user._id, this.state).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const username = this.state.username;
        const email = this.state.email;
        const phone = this.state.phone;
        const notifyTime = this.state.notifyTime;
        let displayTime = this.state.displayTime;
        const isEmail = this.state.isEmail;
        const isSMS = this.state.isSMS;
        const msg = this.state.msg;

        let utc = notifyTime.split(/[.,\/ :]/)
        let hf = utc[0];
        let mf = utc[1];
        let temp = new Date();
        let now = new Date(Date.UTC(temp.getUTCFullYear(), temp.getUTCMonth(), temp.getUTCDay(), hf, mf, temp.getUTCSeconds(), temp.getUTCMilliseconds()))
        let local = now.toLocaleTimeString()
        let localSplit = local.split(/[.,\/ :]/)
        let h = localSplit[0];

        if(localSplit[localSplit.length - 1] == "PM") {
            h = parseInt(h) + 12;
        }

        if(h.length == 1) {
            h = "0" + h
        }
        displayTime = h + ":" + localSplit[1]
        console.log(displayTime)
        return (
            <div className="login-container">
                <div className="entered-info">
                    <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                        <p style={{color:"red"}}>{msg}</p>
                        <div className="form-group"> 
                            <label><h2>Username: </h2></label>
                            <input type="text"
                                required
                                className="form-control"
                                onChange={this.onUsernameChange}
                                value={username}
                            />
                        </div>

                        <div className="padded-div-top-btm">
                            <div className="form-group"> 
                                <label><h2>Email: </h2></label>
                                <input  type="email"
                                    className="form-control"    
                                    onChange={this.onEmailChange}
                                    value={email}
                                />
                            </div>
                        </div>

                        <div className="padded-div-top-btm">
                            <div className="form-group"> 
                                <label><h2>Phone: </h2></label>
                                <input  type="tel"
                                    className="form-control"    
                                    onChange={this.onPhoneChange}
                                    value={phone}
                                />
                            </div>
                        </div>

                        <div className="padded-div-top-btm">
                            <div className="form-group"> 
                                <label><h2>Notification Time: </h2></label>
                                <input type="time" value={displayTime} onChange={this.onNotifyTimeChange}
                                />
                            </div>
                        </div>

                        <div className="padded-div-top-btm">
                            <div className="form-group"> 
                                <label><h2>Enable Email Notifications: </h2></label>
                                <input type="checkbox"  
                                    onChange={this.onIsEmailChange}
                                    checked={isEmail}
                                />
                            </div>
                        </div>

                        <div className="padded-div-top-btm">
                            <div className="form-group"> 
                                <label><h2>Enable SMS Notifications: </h2></label>
                                <input type="checkbox"
                                    onChange={this.onIsSMSChange}
                                    checked={isSMS}
                                />
                            </div>
                        </div>

                        <div className="form-group sign-up">
                            <input type="submit" value="Submit" className="btn btn-block btn-primary" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}