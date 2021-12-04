import React, {Component} from 'react';
// import '../../backend/public'
import '../index.css';
import axios from 'axios';

class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: '',
          email: '',
          message: ''
        }
}
    render() {
        return (
            <div className="App">
                <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" value={this.state.name} onChange={this.onNameChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" aria-describedby="emailHelp" value={this.state.email} onChange={this.onEmailChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea className="form-control" rows="5" value={this.state.message} onChange={this.onMessageChange.bind(this)} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }

    onNameChange(event) {
        this.setState({name: event.target.value})
      }
    
      onEmailChange(event) {
        this.setState({email: event.target.value})
      }
    
      onMessageChange(event) {
        this.setState({message: event.target.value})
      }
    
      handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        const back = process.env.NODE_ENV === 'production' ? 'https://hydroclock.herokuapp.com/' : 'http://localhost:5005';
        axios.post(`https://hydroclock.herokuapp.com/contact`, this.state).then(res => console.log(res.data));
        // sendMail('therambory@gmail.com', subject, bodyText, bodyHTML).then(result => console.log("Email sent to " + res.data[i].email + " successfully.")).catch(error => console.log(error.essage));
      }
    }
    
    export default ContactUs;