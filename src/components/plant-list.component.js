import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Plant from './plant.component';
import '../index.css';

export default class PlantList extends Component {
    constructor(props) {
        super(props);

        // console.log(this.props);
        this.state = {plants:this.props.plants};
    }

componentWillMount() {
    if(null===this.props.currentUser) {
        let sessionData=this.props.getUserDataFromSession();
        this.setState({plants:sessionData.plants});
        console.log(this.state);
    }
}

    render() {
        let cards = [];
        const plants = this.state.plants;
        for (var i=0; i < plants.length; i++) {
            let temp = plants[i].dateCreated;
            let local = new Date(temp).toLocaleDateString();
            cards.push(<div className="card m-3" style={{width:"20rem"}}><Plant plantname={plants[i].plantname} daystowater={plants[i].daystowater} dateCreated={local}/></div>);
        }
        return (
        <div className="dashboard-container login-container">
            <h1>Your Plants:</h1>
            <div className="container padded-div-top-btm">
                <div className="row justify-content-center">
                   {cards}
                    <div className="card text-center" style={{width:"20rem"}}>
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