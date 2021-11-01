import React, {Component} from 'react';
import axios from 'axios';

export default class AddPlant extends Component {
  
    render() {
        return (
            <div>
            <h3>Add New Plant</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <label>Plant Name: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.plantname}
                    onChange={this.onChangePlant}
                    />
              </div>
              <div className="form-group"> 
                <label>Plant Name: </label>
                <input type="text"
                    required
                    className="form-control"
                    value={this.state.plantname}
                    onChange={this.onChangePlant}
                    />
              </div>
              <div className="form-group">
                <input type="submit" value="Add Plant" className="btn btn-primary" />
              </div>
            </form>
          </div>
        )
    }
}