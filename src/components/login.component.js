import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {email:"", password:"", msg:""}

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onAuthenticationFailed = this.onAuthenticationFailed.bind(this);
        this.processResponse = this.processResponse.bind(this);
    }
    
    onEmailChange(event) {
        this.setState({email: event.target.value});
    }
    
    onPasswordChange(event) {

        // let passValid = false;
        // const pass = /[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/
        // if(!pass.test(this.state.password)) {
        //     passValid = false
        // } else {
        //     passValid = true;
        // }
        // console.log(passValid)
        this.setState({password: event.target.value});
    }

    onAuthenticationFailed(res) {
        // if (res.status === 401) {
            this.setState({msg:"Authentication failed. Please try again."});
        // }
    }

    processResponse(res) {
        if (res.status === 200) {
            this.props.onUserAuthenticated(res.data.msg);
            localStorage.setItem("currentUser", res.data.msg.username);
            this.props.history.push(`/dashboard`);
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // CONNECT TO BACKEND ENDPOINT HERE
        axios.post('http://localhost:5005/api/auth/login', this.state).then(res => this.processResponse(res)).catch(res => this.onAuthenticationFailed(res));
    }
  
    render() {
        const email = this.state.email;
        const password = this.state.password;
        const msg = this.state.msg;

        return (
            <div className="login-container">
                <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <p style={{color:"red"}}>{msg}</p>


                    <div className="entered-info">
                        <div className="form-group"> 
                            <label><h2>Email: </h2></label>
                            <input  type="email"
                                required
                                className="form-control"    
                                onChange={this.onEmailChange}
                                value={email}
                            />
                        </div>
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



                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-lg btn-block btn-primary mx-auto d-block" />
                    </div>
                </form>
                <div className="sign-up">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        )
    }
}