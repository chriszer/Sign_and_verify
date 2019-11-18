import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import  Verification from './abis/Verification.json';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: "",
      txhash:"",
      loading: true,
      message:"",
      signature:"",
      signedBy:""
    }
  }


  async componentDidMount() {
    await this.loadWeb3()
    await this.load()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async load() {
    const web3 = window.web3

    //load account
    const accounts = await web3.eth.getAccounts()

    //set the account state from empty to accounts[0]
    this.setState({ account: accounts[0]  })

    const networkId = await web3.eth.net.getId()
    const networkData = await Verification.networks[networkId];

    
    if(networkData){
      let { account } = this.state;

      const verification = new web3.eth.Contract(Verification.abi, networkData.address)
      this.setState({ verification })
     
    }

 
  
  }


  SignMessage = async() => {
    const web3 = window.web3;

    let message = this.message.value
    message = Web3.utils.sha3(message);
    
  
    
    //sign the message with account
    let result = await web3.eth.personal.sign(message,this.state.account);
    this.setState({message, signature:result})
  }

  verifySignature = async() => {
    const web3 = window.web3;
     var {account, verification, signature, message} = this.state
     
     
     const signer = await web3.eth.personal.ecRecover(message, signature);

     this.setState({ signedBy:signer })

    
       
  }
 

  render(){
  return (
    <div >
       
      

      <h1>Sign a Message</h1>
      <p>Sign a message from your account</p>
      <input ref={(input) => {this.message = input}} /> 
      <input type="button" onClick={this.SignMessage} value="Sign & Send"/>
      <br/>
      <h3>{`message: ${this.state.message}`}</h3>
      <h2>{`signature: ${this.state.signature}`}</h2>
      

      <input type="button" onClick={this.verifySignature} value="Verify Signature"/>
      <h2>{`this account signed the message: ${this.state.signedBy}`}</h2>
    </div>
  );
 }
}
export default App;
