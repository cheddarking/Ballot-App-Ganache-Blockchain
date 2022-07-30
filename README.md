# Ballot App

This project is bootstraped with [Create React App](https://create-react-app.dev). It is unopinionated with only `web3.js` as an added dependency, so nothing stands in your way.

## Getting started

Follow the simple steps below to test this app.

1. To use this app you need to run a local Ethereum blockchain on your machine. For this you can download and install the [Ganache UI app](https://trufflesuite.com/ganache/) to create one 

2. Open the Ganache UI app and start a local blockchain. 

3. Open the truffle folder in your terminal and run `truffle migrate --reset`. This will deploy the Ballot smart contract to the Ganache blockchain.

4. Install the [Metamask Wallet extension]( https://metamask.io/download/) to your browser to interact with the blockchain.

5. In Metamask, click on "Add a network" and add the local blockchain to your browser with the following details:
•	Network Name: Ganache 
•	RPC URL: HTTP://127.0.0.1:7545
•	Chain ID: 5777
•	Currency Symbol: ETH

6. Clone this repository to your local machine using the CLI command "git clone https://github.com/cheddarking/Ballot-App-Ganache-Blockchain.git" or download it from this [link](https://github.com/cheddarking/Ballot-App-Ganache-Blockchain/archive/refs/heads/main.zip)

7. Open the root folder in your terminal and run `npm start` to start the dev server. This will launch the app in your browser at the address http://localhost:3000.

8. In Metamask, select the Ganache network you configured in step 5. Click the “Connect Wallet” button in the web page to connect Metamask to the app. This will launch Metamask. Now click “Select All” in the Metamask wizard to allow the app to connect to all the imported Ganache blockchain accounts.

9. Get voting! :)
