import React, {Component} from 'react';
import ipfs from './ipfs'
import SimpleStorageContract from './Hashes.json'
import getWeb3 from './utils/getWeb3'


class UploadFiles extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            logged: true,
            username: '',
            password: '',
            ipfsHash: '',
            web3: null,
            buffer: null,
            account: null
        }
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
      
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
                //this.simpleStorageInstance.getFilesFromUser().then((result) => {console.log(result)})
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

    render() {
        return (
            <div>
            <h1>Upload Files</h1>
            <p>This is the first version of the decentralized aplication for using IPFS and Blockchain to update files.</p>
            <form onSubmit={this.onSubmit} >
                      <div className="form-group">
                      <label for="exampleInputFile"> File input</label>
                      <input type="file" className="form-control-file" id="exampleInputFile" onChange={this.captureFile} aria-describedby="fileHelp"/>
                      </div>
                      <button className="btn btn-dark btn-sm">+ Upload</button>
                    </form>
            </div>
        );
    }
}

export default UploadFiles