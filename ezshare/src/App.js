import React, { Component } from 'react'
import SimpleStorageContract from './Hashes.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'
import {
  Route,
  NavLink,
  HashRouter
} from 'react-router-dom';
import Home from './Home';
import UploadFiles from './UploadFiles';
import MyFiles from './MyFiles';

//import './css/oswald.css'
//import './css/open-sans.css'
//import './App.css'
import './css/bootstrap.min.css'
import './css/navbar.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        logged: true,
        username: 'Username',
        password: '',
        ipfsHash: '',
        web3: null,
        buffer: null,
        account: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onEnrollment = this.onEnrollment.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  
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
            this.simpleStorageInstance.getFilesFromUser().then((result) => {console.log(result)})
            // Get the value from the contract to prove it worked.
            //return this.simpleStorageInstance.get.call(accounts[0])
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

    //OLD SUBMIT
    /*onSubmit(event) {
        event.preventDefault()
        ipfs.files.add(this.state.buffer, (error, result) => {
            if (error) {
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
    }*/

    onSubmit(event) {
      event.preventDefault()

      /* IPFS ADDS FILE */
      ipfs.files.add(this.state.buffer, (error, result) => {
        if (error) {
            console.error(error)
            return
        }
        this.simpleStorageInstance.addFile(result[0].hash, { from: this.state.account }).then(function(result) {
            alert('IPFS add succesfull');
          }).catch(function(err) {
            console.log(err.message);
          });
    })
  }

onEnrollment(event) {
  event.preventDefault()
  console.log(this.state.username)
  console.log(this.state.password)
  this.simpleStorageInstance.userEnrollment(this.state.username, this.state.password, { from: this.state.account }).then((result) => {
    console.log(result);
  }).catch(function(err) {
    console.log(err.message);
  });
  console.log(this.state.account)
}

  onLogin(event) {
    event.preventDefault()
    console.log(this.state.account)
    this.simpleStorageInstance.login('xd', { from: this.state.account }).then((result) => {
      console.log(result); 
      this.setState({ logged: true}) 
    }).catch(function(err) {
        console.log(err.message);
      });
   // this.simpleStorageInstance.getMyUserName().then((result) => {console.log(result)})
    this.simpleStorageInstance.getMyUserName().then((result) => {console.log(result)})
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  } 

  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }

  /*ALBERTO'S LOGIN
  onLogin(event) {
    event.preventDefault()
    this.simpleStorageInstance.userEnrollment('alberto', 'xd', { from: this.state.account })
    this.simpleStorageInstance.login('xd', { from: this.state.account })
    this.simpleStorageInstance.getMyUserName().then((result) => {console.log(result)})
  }*/

  /* INTERNET LOGIN EXAMPLE 
  handleEmailChange: function(e) {
   this.setState({email: e.target.value});
},
handlePasswordChange: function(e) {
   this.setState({password: e.target.value});
},
render : function() {
      return (
        <form>
          <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
          <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
          <button type="button" onClick={this.handleLogin}>Login</button>
        </form>);
},
handleLogin: function() {
    console.log("EMail: " + this.state.email);
    console.log("Password: " + this.state.password);
}*/



  render(){
    
    if (this.state.logged) {
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
        <HashRouter>
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            
            <div className="sidebar-sticky">
            
              <ul className="header">
              <li><NavLink to="/Home">Home</NavLink></li>
              <li><NavLink to="/MyFiles">My Files</NavLink> </li>
              <li><NavLink to="/UploadFiles">Upload Files</NavLink> </li>
              </ul> 
            </div>
            
          </nav></HashRouter>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <HashRouter>
              <div className="content">
              <Route path="/Home" component={Home}/>
              <Route path="/MyFiles" component={MyFiles}/>
              <Route path="/UploadFiles" component={UploadFiles}/>
              
            </div>
            </HashRouter>
          </main>
          
          </div>
        </div>
        </div>
       
          );
    }

    else {
        return (
            <div className="App">
            <form onSubmit={this.onLogin}>
             <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
             <label htmlFor="inputUsername" className="sr-only">Username</label>
             <input type="text" id="inputUsername" className="form-control" placeholder="username" value={this.state.username} onChange={this.handleUsernameChange} required="" autoFocus=""/>
             <label htmlFor="inputPassword" className="sr-only">Password</label>
             <input type="password" id="inputPassword" className="form-control" placeholder="password"  value={this.state.password} onChange={this.handlePasswordChange} required=""/>
             <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
             <p className="mt-5 mb-3 text-muted"/>
           </form>
           <form onSubmit={this.onEnrollment}>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Enroll me</button>
           </form>
           
           
           </div>
        
        )

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

      /* IPFS HASH ADDED TO BLOCKCHAIN */
      /*this.simpleStorageInstance.addFile('983umskjdsfh892hfy89hf8d9sh', { from: this.state.account }).then(function(result) {
        alert('Transfer Successful!');
      }).catch(function(err) {
        console.log(err.message);
      });*/

    //  -------------------------------------------------------------------------------------------------------------------------


/*
      this.simpleStorageInstance.getFilesFromUser().then((result) => {console.log(result)})
    }
  
    onLogin(event) {
      event.preventDefault()
      this.simpleStorageInstance.userEnrollment('alberto', 'xd', { from: this.state.account })
      this.simpleStorageInstance.login('xd', { from: this.state.account })
      this.simpleStorageInstance.getMyUserName().then((result) => {console.log(result)})
    }

              <form onSubmit={this.onSubmit} >
                <div className="form-group">
                  <label for="exampleInputFile">File input</label>
                  <input type="file" className="form-control-file" id="exampleInputFile" onChange={this.captureFile}  aria-describedby="fileHelp"/>
                </div>
                <button className="btn btn-primary" type='submit'>Submit</button>
              </form>
             
             </div>
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

              <form onSubmit={this.onLogin} >
                <button className="btn btn-primary" type='submit'>Login hardcoded</button>
              </form>

              <hr></hr>

                <h1>Your File</h1>
                <p>This image is stored on IPFS & The Ethereum Blockchain!</p>

                <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
                <h2>Upload File</h2>

                <form onSubmit={this.onSubmit} >
                    <div className="form-group">
                    <label for="exampleInputFile">File input</label>
                    <input type="file" class="form-control-file" id="exampleInputFile" onChange={this.captureFile}  aria-describedby="fileHelp"/>
                    </div>
                    <button className="btn btn-primary" type='submit'>Submit</button>
                </form>
                
                </div>
                </div>
            </div>
            
        </div>
        );
}*/
}

export default App
