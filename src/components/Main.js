import React, { Component } from 'react'
import 'aframe';
import App from './App'
import './App.css'


class Main extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            voteDisabled: false,
            voteId: ''
        };
    }

    handleChange = (event) => {
        console.log('candidate id', event.target.value)
        this.setState({ voteId: event.target.value });
    };

    render() {
        var candidateData = JSON.stringify(this.props.data)
        return (
            <div className="ARGraph">
                <div id="embeddedScene">
                    <a-scene background="color: grey" embedded>
                        <a-light type="point" intensity="1" position="-2 10 10"></a-light>
                        <a-entity charts="type: bar; dataPoints: candidateData; axis_length: 12"></a-entity>
                        <a-entity position="2 10 14" rotation="-30 15 0">
                            <a-camera position="3 -1 4" rotation="0 -1 0">
                                <a-cursor></a-cursor>
                            </a-camera>
                        </a-entity>
                    </a-scene>
                </div>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    this.props.castVotes(this.state.voteId)
                    this.setState({ voteDisabled: true })
                }}>
                    <div className="form-group">
                        <label htmlFor="candidatesSelect">Select Candidate</label>
                        <select onChange={this.handleChange} value={this.state.voteId} className="form-control" id="candidatesSelect">
                            <option >Select an Option</option>
                            {this.props.candidateList && this.props.candidateList.map(candidate =>
                            (
                                <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                            )
                            )}
                        </select>
                    </div>
                    {!this.state.voteDisabled &&
                        <button type="submit" className="btn btn-primary" >Vote</button>
                    }
                    <hr />
                </form>

            </div>
        );
    }
}

export default Main;