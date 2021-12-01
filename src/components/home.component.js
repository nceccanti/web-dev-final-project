import React, {Component} from 'react';
import backgroundImg from '../img/home-background-medium.jpg';
import '../index.css';

export default class Home extends Component {
  
    render() {
        return (
            <div>
                <div className="home-content">
                    <h2>Plants are great! But taking care of them can be hard.</h2><br/>
                    <h2>That's why we made HydroClock!</h2>
                    <br/><br/>
                    <ul>
                        <div className="list-item-one">
                            <li>Get watering reminders</li>
                        </div>
                        <div className="list-item-two">
                        <li>Find plant care tips based on plant type</li>
                        </div>
                    </ul>
                </div> 
                <div>
                    {/* 
                      * TODO: fix formatting on this image
                      *<img src={backgroundImg} id="bg" alt=""></img> 
                      */}
                </div> 
            </div>      
        )
    }
}