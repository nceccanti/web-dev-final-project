import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

export default class Plant extends Component {
    constructor(props) {
        super(props);

        this.state = {plantname: this.props.plantname,
        daystowater:this.props.daystowater,
        dateCreated:this.props.dateCreated}
    }

    render() {
        const plantname = this.state.plantname;
        const daystowater = this.state.daystowater;
        const dateCreated = this.state.dateCreated;
        const qString = "?plant=" + plantname;
        return (
        <div className="card-body">
            <h4 className="card-title">{plantname}</h4>
            <p className="card-text">Time til next watering: {daystowater}</p>
            <p className="card-text">Date created: {dateCreated}</p>
            <Link to={{pathname: "/editplant", search:qString}} className="card-link">Edit</Link>
            <Link to={{pathname: "/deleteplant", search:qString}} className="card-link">Delete</Link>
        </div>
        )
    }
}