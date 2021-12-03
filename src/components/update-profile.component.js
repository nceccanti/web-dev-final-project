import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

export default class EditUser extends Component {
    constructor(props) {
        super(props)

        let user = this.props.user;
        console.log(this.props);

        this.state = {
            username:user.username,
            _id:user._id,
            email:user.email, 
            phone:user.phone,
            notifyTime:user.notifyTime,
            isEmail:user.isEmail,
            isSMS:user.isSMS,
            msg: ""
        }

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onIsEmailChange = this.onIsEmailChange.bind(this);
        this.onNotifyTimeChange = this.onNotifyTimeChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onIsSMSChange = this.onIsSMSChange.bind(this);
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
        this.setState({notifyTime:event.target.value})
    }

    onIsSMSChange(event) {
        this.setState({isSMS: event.target.checked});
    }

    onMessageChange(message) {
        this.setState({msg: message})
    }
    
    processResponse(res) {
        if (res.status === 200) {
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
        axios.post('http://localhost:5005/users/update/'+this.props.user._id, this.state).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const username = this.state.username;
        const email = this.state.email;
        const phone = this.state.phone;
        const notifyTime = this.state.notifyTime;
        const isEmail = this.state.isEmail;
        const isSMS = this.state.isSMS;
        const msg = this.state.msg;

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
                                <input type="time" value={notifyTime} onChange={this.onNotifyTimeChange}
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