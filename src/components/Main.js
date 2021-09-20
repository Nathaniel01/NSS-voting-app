import React, { Component } from 'react'



class Main extends Component {

  render() {
    return (
    <div id="content" >
        <table className="table" >
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Votes</th>
                </tr>
            </thead>
            <tbody id="candidatesResults">
                {this.props.displayCandidates}
            </tbody>
        </table>

        <form onSubmit={(event) => {
            event.preventDefault()
            this.props.castVotes()
        }}>
            <div className="form-group">
                <label htmlFor="candidatesSelect">Select Candidate</label>
                <select className="form-control" id="candidatesSelect">
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Vote</button>
            <hr />
        </form>
    </div>
    );
  }
}

export default Main; 