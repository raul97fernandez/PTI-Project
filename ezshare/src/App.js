import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

//import './css/oswald.css'
//import './css/open-sans.css'
//import './App.css'
import './css/bootstrap.min.css'
import './css/navbar.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        ipfsHash: '',
        web3: null,
        buffer: null,
        account: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.logged = false
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.simpleStorageInstance.get.call(accounts[0])
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
        this.setState({ buffer: Buffer(reader.result) })
        console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
        console.error(error)
        return
      }
      this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((result) => {
        return this.simpleStorageInstance.get.call(this.state.account)
      }).then((ipfsHash) => {
        this.setState({ ipfsHash })
        console.log('ipfshash', this.state.ipfsHash)
      })
    })
  }


  render(){
    
    if (this.logged) {
        return (
        
       <div className="App">
    
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">EZShare</a>
          <input className="form-control w-100" type="text" placeholder="Search" aria-label="Search"/>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <button className="btn btn-alert ">Search</button>
            </li>
          </ul>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#">Sign out</a>
            </li>
          </ul>
        </nav>
    
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
            
              <ul className="nav flex-column">
              <li className="nav-item">
                  <a className="nav-link active" href="#">
                    <form onSubmit={this.onSubmit} >
                      <div className="form-group">
                      <label for="exampleInputFile"> File input</label>
                      <input type="file" className"form-control-file" id="exampleInputFile" onChange={this.captureFile} aria-describedby="fileHelp"/>
                      </div>
                      <button className="btn btn-dark btn-sm">+ Upload</button>
                    </form>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    <span data-feather="home"></span>
                    My Files <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file"></span>
                    People
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          </div>
        </div>
        </div>
          );
    }

    else {
        return {
            <div className="App">
            <form className"form-signin">
             <img className"mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
             <h1 className"h3 mb-3 font-weight-normal">Please sign in</h1>
             <label for="inputEmail" className"sr-only">Email address</label>
             <input type="email" id="inputEmail" className"form-control" placeholder="Email address" required="" autofocus="">
             <label for="inputPassword" className"sr-only">Password</label>
             <input type="password" id="inputPassword" className"form-control" placeholder="Password" required="">
             <div className"checkbox mb-3">
               <label>
                 <input type="checkbox" value="remember-me"> Remember me
               </label>
             </div>
             <button className"btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
             <p className"mt-5 mb-3 text-muted">© 2017-2018</p>
           </form>
           </div>
        
    }

    }
    }
/*
  render() {
    return (
      <div className="App">
        
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">EZShare</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Upload <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Download</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">My Files</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Search</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Settings</a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Hi (User)!</a></li>
          </ul>
        </div>
      </nav>

       <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>Your File</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!</p>

              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h2>Upload File</h2>

              <form onSubmit={this.onSubmit} >
                <div className="form-group">
                  <label for="exampleInputFile">File input</label>
                  <input type="file" className="form-control-file" id="exampleInputFile" onChange={this.captureFile}  aria-describedby="fileHelp"/>
                </div>
                <button className="btn btn-primary" type='submit'>Submit</button>
              </form>
             
             </div>
            </div>
          </div>
        
      </div>


    )
  }*/
}

export default App
