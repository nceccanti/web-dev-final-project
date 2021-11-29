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
        if (res.status === 201) {
            this.onMessageChange("Account created");
        }
        else if (res.status === 500) {
            this.onMessageChange("Could not create account");
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5000/api/auth/signup', this.state).then(res => this.processResponse(res)).catch(res => this.processResponse(res));
    }
  
    render() {
        const email = this.state.email;
        const password = this.state.password;
        const username = this.state.username;
        const msg = this.state.msg;

        return (
            <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                <p style={{color:"red"}}>{msg}</p>
                <div className="form-group"> 
                    <label>Username: </label>
                    <input type="text"
                        required
                        className="form-control"
                        onChange={this.onUsernameChange}
                        value={username}
                    />
                </div>
                <div className="form-group"> 
                    <label>Email: </label>
                    <input  type="email"
                        required
                        className="form-control"    
                        onChange={this.onEmailChange}
                        value={email}
                    />
                </div>
                <div className="form-group"> 
                    <label>Password: </label>
                    <input type="password"
                        required
                        className="form-control"
                        onChange={this.onPasswordChange}
                        value={password}
                    />
                </div>
                <div className="form-group">
                    <input type="submit" value="Sign Up" className="btn btn-primary" />
                </div>
            </form>
        )
    }
}