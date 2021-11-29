import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Plant from './plant.component';
import '../index.css';

export default class PlantList extends Component {
    constructor(props) {
        super(props);

        this.state = {plants:this.props.plants};
    }

    render() {
        let cards = [];
        const plants = this.state.plants;
        for (var i=0; i < plants.length; i++) {
            cards.push(<div className="card m-3" style={{width:"20rem"}}><Plant plantname={plants[i].plantname} daystowater={plants[i].daystowater} dateCreated={plants[i].dateCreated}/></div>);
        }
        return (
        <div>
            <h1>Your Plants</h1>
            <div className="container">
                <div className="row">
                   {cards}
                    <div className="card m-3 text-center" style={{width:"20rem"}}>
                        <div className="card-body">
                            <Link to="/addplant" style={{ textDecoration: 'none' }}>
                                <h4 className="card-title">Add New Plant</h4>
                                <h1 className="card-text">+</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}