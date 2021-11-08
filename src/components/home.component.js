import React, {Component} from 'react';
import backgroundImg from '../img/home-background-medium.jpg';
import '../index.css';

export default class Home extends Component {
  
    render() {
        return (
            <div>
                <img src={backgroundImg} id="bg" alt=""></img>
                <h3>Plants are great! But taking care of them can be hard.</h3><br/>
                <h3>That's why we made HydroClock!</h3>
                <br/><br/>
                <ul>
                    <li>Get watering reminders</li>
                    <li>Find plant care tips based on plant type</li>
                </ul>
            </div>        
        )
    }
}