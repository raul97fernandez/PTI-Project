import React, {Component} from 'react';
import SimpleStorageContract from './Hashes.json'
import getWeb3 from './utils/getWeb3'

class MyFiles extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            logged: true,
            username: '',
            password: '',
            ipfsHash: '',
            web3: null,
            buffer: null,
            account: null,
            files: [],
            listItems: null
        }

        this.filesList = this.filesList.bind(this);
      
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
                this.simpleStorageInstance.getFilesFromUser().then((result) => { 
                    this.setState({
                        files: result.split('/')
                    })
                    //console.log(this.state.files); 
                })
                
                // Get the value from the contract to prove it worked.
                //return this.simpleStorageInstance.get.call(accounts[0])
            }).then((ipfsHash) => {
                // Update state with the result.
                return this.setState({ ipfsHash })
            })
            })
        }

        filesList() {
            const listItems = this.state.files.map((file) =>
              <li>{file}</li>
            );
            return (
              <ul>{listItems}</ul>
            );
          }
    


    render() {

        return (
            <div>
            <h1>My Files</h1>
            <p>This is the first version of the decentralized aplication for using IPFS and Blockchain to update files.</p>

            <ul>
                <li><a href="https://ipfs.io/ipfs/QmNT57eQhqaLRmEhE19WySdfFNkxu9o1FQmwNYtfUSD9bL">QmNT57eQhqaLRmEhE19WySdfFNkxu9o1FQmwNYtfUSD9bL</a></li>
                <li><a href="https://ipfs.io/ipfs/QmNU1SqBh8cZJ3jrfQpQFb2GRKoxAAyhTiCxmZNzxspPtS">QmNU1SqBh8cZJ3jrfQpQFb2GRKoxAAyhTiCxmZNzxspPtS</a></li>
                <li><a href="https://ipfs.io/ipfs/QmVNt21siYcsUTm9iqAkAirig2VJvZtsHzPX1gGtNXj7EG">QmVNt21siYcsUTm9iqAkAirig2VJvZtsHzPX1gGtNXj7EG</a></li>
                <li><a href="https://ipfs.io/ipfs/QmTjp8oxHz5ZFjRd2HRTYYpTrde9ajNXcVLMrH4oKG7K56">QmTjp8oxHz5ZFjRd2HRTYYpTrde9ajNXcVLMrH4oKG7K56</a></li>
            </ul>

            </div>
        );
    }
}

export default MyFiles