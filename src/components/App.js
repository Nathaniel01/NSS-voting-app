import React, { Component } from 'react'
import Web3 from 'web3'
import $ from 'jquery'
import Election from '../abis/Election.json'
import Main from './Main'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  //Lifecycle function for react to launch web3 and load blockchain
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    //get account connected to the blockchain
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })


    // get the network id
    const networkID = await web3.eth.net.getId()
    console.log('network Id: ' + networkID)

    //Load "Web3" version Election contract 
    const electionData = Election.networks[networkID]

    if(electionData){
      const election = new web3.eth.Contract(Election.abi, electionData.address)
      this.setState({ election })
    }else {
      window.alert('Election contract not deployed on the detected network')
    }

    this.setState({ loading: false})
  }

  //Metamask instructions to connect the app to the blockchain
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. Install MetaMask!')
    }
  }


  castVotes = () => {
    this.setState({ loading: true})
    var candidateResults = $("#candidatesResults")
    this.setState({ loading: false})        
  }

  displayCandidates = () => {
    let candidatesCount = this.state.election.methods.candidatesCount()
    var candidatesResults = $("#candidatesResults");
    candidatesResults.empty();

    var candidatesSelect = $('#candidatesSelect');
    candidatesSelect.empty();

    for(var i = 1; i <= candidatesCount; i++){
      let candidate = this.state.election.methods.candidate(i).call()
      var id = candidate[0];
      var name = candidate[1]
      var voteCount = candidate[2]

      var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
      candidatesResults.append(candidateTemplate);

      // Render candidate ballot option
      var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
      candidatesSelect.append(candidateOption);
    }
  }


  constructor(props) {
    super(props)
    this.state = {
      election: {},
      account: '0x0',
      hasVoted: false,
      loading: true
    }
  }

  render() {
    //----Put loading screen
    let content
    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading</p>
    } else {
      content = <Main
        displayCandidates = {this.displayCandidates}
        castVotes = {this.castVotes}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
