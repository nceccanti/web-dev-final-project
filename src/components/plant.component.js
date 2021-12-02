import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

export default class Plant extends Component {
    // Implement me! Supposed to act as a sort of "count down" on the plant cards
    // let current = new Date();
    // let added = this.props.dateCreated;
    // let daysto = this.props.daystowater;
    // timeDifference(current, added, daysto) {
    //     const currentUTC = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
    //     const addedUTC = Date.UTC(added.getFullYear(), added.getMonth(), added.getDate());
    //     let day = 1000*60*60*24;
    //     let to = Math.abs((addedUTC - currentUTC)/day) % daysto;
    //     return to;
    // }
    // daystowater: timeDifference(new Date.toString, this.props.dateCreated, this.props.daystowater),

    constructor(props) {
        super(props);
        
        this.timeDifference = this.timeDifference.bind(this);

        let now = new Date();

        let added = new Date(this.props.dateCreated);

        let daysto = new Date(this.props.daystowater);

        let daystowater = this.timeDifference(now, added, daysto);

        this.state = {
            plantname: this.props.plantname,
            daystowater:daystowater,
            wateringInterval:this.props.daystowater,
            dateCreated:this.props.dateCreated
        }

    }

    timeDifference(current, added, daysto) {
        const currentUTC = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
        const addedUTC = Date.UTC(added.getFullYear(), added.getMonth(), added.getDate());
        let day = 1000*60*60*24;
        let to = Math.abs((addedUTC - currentUTC)/day) % daysto;
        return to;
    }

    render() {
        const plantname = this.state.plantname;
        const wateringInterval = this.state.wateringInterval;
        const daystowater = this.state.daystowater;
        const dateCreated = this.state.dateCreated;
        const qString = "?plant=" + plantname;
        return (
        <div className="card-body">
            <h4 className="card-title">{plantname}</h4>
            <p className="card-text">Watering interval: {wateringInterval}</p>
            <p className="card-text">Days until next watering: {daystowater}</p>
            <p className="card-text">Since: {dateCreated}</p>
            <Link to={{pathname: "/editplant", search:qString}} className="card-link">Edit</Link>
            <Link to={{pathname: "/deleteplant", search:qString}} className="card-link">Delete</Link>
        </div>
        )
    }
}