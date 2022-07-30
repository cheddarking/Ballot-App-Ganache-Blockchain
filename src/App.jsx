import React, { useEffect, useState } from "react";
import Web3 from 'web3'
import "./css/bootstrap.min.css";
import "./css/bootstrap.min.css.map";
import "./App.css";
import Proposals from "./components/Proposals";
import Addresses from "./components/Addresses";
import Ballot from "./Ballot.json";

function App() {
  const ganacheUrl = "http://localhost:7545";

  /*
  * State variables we use to store our user's public wallet accounts.
  */
  
  const [currentAccount, setCurrentAccount] = useState(""); // currentAccount is the first account in the wallet
  const [accountsList, setAccountsList] = useState([]); // accountsList is the list of all the user's accounts in the wallet
  const [selectedAccount, setSelectedAccount]=useState(''); // selectedAccount is the currently selected account for voting

  // State variable for the contract instance
  let [web3, setWeb3] = useState(null)


  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xB632C7723aABbEBA7e0363AD063519c25B768bb0"
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = Ballot.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)

        //create a new web3 object with the injected provider from metamask
        let web3 = new Web3(ethereum);
        setWeb3(web3); //set the web3 object to the state variable

        /*create a separate web3 instance with the ganache url as the provider 
        as we cannot pull all the accounts through Metamask, only the first one*/
        const ganacheWeb3 = new Web3(ganacheUrl);
        
        //get the accounts from the provider
        const accountsList = await ganacheWeb3.eth.getAccounts();
        
        console.log("Found this list of accounts on the Ganache chain: ", accountsList)
        //convert the accounts list to an array of objects  
        const accountsArray = accountsList.map(account => {
          return {
            address: account,
            id: accountsList.indexOf(account)
          };
        }
        );

        console.log("Converted accounts to array of objects: ", accountsArray)

        //set the accounts list to the state
        setAccountsList(accountsArray)  
        
        //initialize the contract
        //initContract()
       
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Found this list of accounts on Metamask: ", accounts)

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  /*** Initialise the Contract */
  const initContract = async () => {
    try {
      let ballotContract = await new web3.eth.Contract(contractABI);
      ballotContract.options.address = contractAddress; 
      console.log("Contract is ready to go!", ballotContract);
      return ballotContract;
    } catch (error) {
      console.log(error);
    }
  }
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    //initContract()
    //handleVotedEvent();
      
  }, [])




  //added the /images folder under the /public folder for this to work
  const proposals = [
    {
      "id": 0,
      "name": "Apple",
      "picture": "../images/apple.jpg" 
    },
    {
      "id": 1,
      "name": "Orange",
      "picture": "../images/orange.jpg"
    },
    {
      "id": 2,
      "name": "Mango",
      "picture": "../images/mango.jpg"
    },
    {
      "id": 3,
      "name": "Banana",
      "picture": "../images/banana.jpg"
    }
  ];

  /** Handle voted events from the contract. */
  const handleVotedEvent = async () => {
    let BallotContract = await initContract();
    const blockNumber = await web3.eth.getBlockNumber(); //get the current block number to check if the event has been emitted
    BallotContract.events.votedEvent({
      fromBlock:blockNumber})
    .on("data", (event) => {
      console.log("Voted event: ", event);
      alert(event.returnValues.messageVoted + event.returnValues._voter);
    }
    );
  }

  /** Handle Registration events from the contract. */
  const handleRegistrationEvent = async () => {
    let BallotContract = await initContract();
    const blockNumber = await web3.eth.getBlockNumber(); //get the current block number to check if the event has been emitted
    BallotContract.events.registeredEvent({
      fromBlock:blockNumber})
    .on("data", (event) => {
      console.log("Registered event: ", event);
      alert(event.returnValues.messageRegistered + " " + selectedAccount);
    })  
  } 
  

  //*** Button and Select Event Handler Functions */ 

  const handleSelect = (event) => {
    setSelectedAccount(event.target.value);
    console.log("Selected Account: ", event.target.value);
  }
  
  const handleRegister = async () => {
    try {
      let ballotContract = await initContract();
      //let accounts = await web3.eth.getAccounts();
      let register = await ballotContract.methods.register(selectedAccount).send({ from: currentAccount });
      if (register) {
        console.log("Registered the account: ", selectedAccount);
        handleRegistrationEvent();
      }
      //console.log("Account registered!", vote);
    } catch (error) {
      console.log(error);
    }
  }

  const handleVote = async (event) => {
    //get the id of the selected proposal
    let proposalId = event.target.getAttribute('data-id'); //get the data-id attribute from the button
    console.log("Proposal ID: ", proposalId);
    try {
      let ballotContract = await initContract();
      //let accounts = await web3.eth.getAccounts();
      let vote = await ballotContract.methods.vote(proposalId).send({ from: selectedAccount, gas: 3000000 });
      console.log("Vote sent!", vote);
      handleVotedEvent();
    } catch (error) {
      console.log(error);
      if (error.message.includes("not been authorized by the user")) {
        alert(`Switch your Metamask account to the current selected Address: ${selectedAccount} and try again!`);
      }             
    }
  }

  const handleWinner = async () => {
    try {
      let ballotContract = await initContract();
      let winner = await ballotContract.methods.winningProposal().call();
      console.log(`The winner is: ${proposals[winner].name}`);
      alert(`The winner is: ${proposals[winner].name}`);
    } catch (error) {
      console.log(error);
    }
  }

  const getCount = async () => {
    try {
      let ballotContract = await initContract();
      let count = await ballotContract.methods.getCount().call();
      console.log(count);
      alert(`The current ballot count is: 
                    ${proposals[0].name}: ${count[0]}
                    ${proposals[1].name}: ${count[1]}
                    ${proposals[2].name}: ${count[2]}
                    ${proposals[3].name}: ${count[3]}`);
      //alert(`The winner is: ${proposals[winner].name}`);
    } catch (error) {
      console.log(error);
    }
  }

  //Populate the interface with the Proposals component
  const proposal = proposals.map( item => {
    return (
      <Proposals key={item.id} //pulls the id attribute from it, makes a JSX warning go away
            item={item}   //passes the item object to the property "item"
            handleVote={handleVote} //passes the handleVote function to the property "handleVote"
      />
    )
  })

  return (
    <div>
      <div className="container">
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-sm-push-2">
            <h1 className="text-center">A Demo Voting App Built on Ethereum</h1>
            <br />
            <h2 className="text-center">Pick Your Favorite Fruit</h2>
            <hr/>
            <br/>            
          </div>
        </div>
      </div>

      <div id="proposalsRow" className="row" style={{marginLeft: '40px', marginRight: '40px'}}>
        {proposal}  
      </div>
      <Addresses  options={accountsList}
                  handleRegister={handleRegister}
                  handleSelect={handleSelect}
                  handleWinner={handleWinner}
                  getCount={getCount}
                                    
      />
     

    </div>
  
  );
}

export default App;
