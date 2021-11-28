import React, {Component} from 'react';
import '../index.css';

export default class PlantList extends Component {
    constructor(props) {
        super(props);

        this.state = {plants:null};
    }
    render() {
        return (
        <div>
            <h1>plant list</h1>
        </div>
        )
    }
}