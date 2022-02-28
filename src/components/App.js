import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../abis/Election.json'
import Main from './Main'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  //Lifecycle function for react to launch web3 and load blockchain
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

  }

  async loadBlockchainData() {
    const web3 = window.web3

    //get account connected to the blockchain
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // get the network id
    const networkID = await web3.eth.net.getId()

    //Load "Web3" version Election contract 
    const electionData = Election.networks[networkID]

    if (electionData) {
      //Instantiate election data into state
      const election = new web3.eth.Contract(Election.abi, electionData.address)
      this.setState({ election })

      //Load candidate count
      let candidatesCount = await election.methods.candidatesCount().call()
      this.setState({ candidatesCount })

      //Load the required candidates
      for (let i = 1; i <= this.state.candidatesCount; i++) {
        let candidate = await election.methods.candidates(i).call()
        let candidates = {}
        candidates.id = candidate[0]
        candidates.name = candidate[1]
        candidates.voteCount = candidate[2]

        this.setState(prevState => ({
          candidateList: [...prevState.candidateList, candidates]
        }))
      }

      const COLOR = ["red", "blue", "green"]
      var n = -3.5
      // Format data type for 3d graph
      for (let i = 1; i <= this.state.candidatesCount; i++) {
        let candidate = await election.methods.candidates(i).call()
        let candidatesData = {}
        n = n + 3.5

        candidatesData.x = n
        candidatesData.y = candidate[2]
        candidatesData.z = 0
        candidatesData.size = 1
        candidatesData.color = COLOR[(i - 1)]

        this.setState(prevState => ({
          data: [...prevState.data, candidatesData]
        }))
      }

      // Check if account has voted.
      let voterStatus = await election.methods.voters(this.state.account).call()
      console.log(voterStatus)
      this.setState({ hasVoted: voterStatus})

      console.debug(JSON.stringify(this.state.data))
      console.debug(JSON.stringify(this.state.candidateList))
    } else {
      window.alert('Election contract not deployed on the detected network')
    }

    this.setState({ loading: false })
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


  castVotes = (id) => {
    console.log('Collected vote id', id)
    this.setState({ loading: true })
    let candidateID = id//get candidate by id
      this.state.election.methods.vote(candidateID).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ hasVoted: true })
      })
    this.setState({ loading: false })
  }

  constructor(props) {
    super(props)
    this.state = {
      election: {},
      account: '0x0',
      hasVoted: false,
      loading: true,
      candidateList: [],
      candidatesCount: 0,
      data: []
    }
  }

  render() {
    //----Put loading screen
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading</p>
    } else {
      content = <Main
        candidateList={this.state.candidateList}
        castVotes={this.castVotes}
        data={this.state.data}
        hasVoted={this.state.hasVoted}
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
                  href=""
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
