import React, { Component } from 'react'
import App from './App';
import 'aframe';
import { Entity, Scene } from 'aframe-react'

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

        return (
            <div className="ARGraph">
                <Scene className={"a-frame-wrapper"}
                    light="defaultLightsEnabled: False"
                    embedded
                    shadow="type: soft"
                >
                </Scene>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    this.props.castVotes(this.state.voteId)
                    this.setState({ voteDisabled: true })
                }}>
                    <div className="form-group">
                        <label htmlFor="candidatesSelect">Select Candidate</label>
                        <select onChange={this.handleChange} value={this.state.voteId} className="form-control" id="candidatesSelect">
                            <option value={this.state.voteId}>Selected Option</option>
                            {this.props.candidateList && this.props.candidateList.map(candidate =>
                            (
                                <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                            )
                            )}
                        </select>
                    </div>
                    {!this.state.voteDisabled &&
                        <button type="submit" className="btn btn-primary" >Voted</button>
                    }
                    <hr />
                </form>
            </div>
        );
    }
}

export default Main;