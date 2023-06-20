import React, { useState, useEffect } from "react";
import Web3 from "web3";
import tbnbContractABI from "./tbnbContractABI.json";

const tbnbContractAddress = "0x094616f0bdfb0b526bd735bf66eca0ad254ca81f";

const web3 = new Web3(window.ethereum);

function App() {
  const [account, setAccount] = useState("");
  const [web3Connected, setWeb3Connected] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const connectToMetaMask = async () => {
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3Connected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };

    if (window.ethereum) {
      connectToMetaMask();
    } else {
      console.error("MetaMask not detected");
    }
  }, []);

  const handleTransfer = async () => {
    try {
      const amountInWei = web3.utils.toWei(amount, "ether");
      console.log("amountInwei:", amountInWei);

      const tbnbContract = new web3.eth.Contract(
        tbnbContractABI,
        tbnbContractAddress
      );

      const result = await tbnbContract.methods
        .transfer(receiverAddress, amountInWei)
        .send({ from: account });
      console.log("Transfer successful:", result);
    } catch (error) {
      console.error("Error transferring TBNB:", error);
    }
  };

  console.log("amout :>", amount);
  console.log("receiverAddress :>", receiverAddress);

  return (
    <div>
      {web3Connected ? (
        <div>
          <p>Connected with MetaMask</p>
          <p>Account: {account}</p>
          <input
            type="text"
            placeholder="Receiver Address"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={handleTransfer}>Transfer TBNB</button>
        </div>
      ) : (
        <p>Connecting to MetaMask...</p>
      )}
    </div>
  );
}

export default App;
