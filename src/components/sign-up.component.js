import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

export default class SignUp extends Component {

    constructor(props) {
        super(props)
        this.state = {email:"", password:"", username:"", msg:""}

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);


    }
    
    onEmailChange(event) {
        this.setState({email: event.target.value});
    }
    
    onPasswordChange(event) {
        this.setState({password: event.target.value});
    }

    onUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    onMessageChange(message) {
        this.setState({msg: message});
    }
    
    processResponse(res) {
        let userValid = false;
        const user = /^[a-z0-9_\.]+$/;
        if(!user.test(this.state.username)) {
            userValid = false
        } else {
            userValid = true
        }

        let passValid = false;
        const pass = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/
        if(!pass.test(this.state.password)) {
            passValid = false
        } else {
            passValid = true;
        }

        if (res.status === 201 && userValid && passValid) {
            this.onMessageChange("Account created");
        }
        else if (res.status === 500) {
            this.onMessageChange("Could not create account");
        } else if(!userValid) {
            this.onMessageChange("Invalid username. Try removing special characters.")
        } else if(!passValid) {
            this.onMessageChange("Password must contain 8 characters, at least one number, and one special character.")
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5005/api/auth/signup', this.state).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const email = this.state.email;
        const password = this.state.password;
        const username = this.state.username;
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
                                    required
                                    className="form-control"    
                                    onChange={this.onEmailChange}
                                    value={email}
                                />
                            </div>
                        </div>

                        <div className="padded-div-top-btm">
                            <div className="form-group"> 
                                <label><h2>Password: </h2></label>
                                <input type="password"
                                    required
                                    className="form-control"
                                    onChange={this.onPasswordChange}
                                    value={password}
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