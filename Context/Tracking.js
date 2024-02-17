import React, {useState , useEffect} from "react";
import Web3Modal from "web3modal";
import {FetchCancelSignal, ethers} from "ethers";


//doing internals imports

import tracking from "../Context/Tracking.json";  //importing the ABI
const ContractAddress = "";
const ContractABI = tracking.abi;

// fncns for fetching Ssmart contract

const fetchContract = (signerOrProvider) // for knonwing who is intreacted wth SM
new ethers.Contract(ContractAddress, Contract, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({children}) => {
    const DappName = "Product Taking Dapp";
    const [currentUser , setCurrentUser] = useState;

    const createShipment = async (items) => {
        console.log(items);
        const {receiver, pickupTime, distance, price} = items;

        try {
            const  web3modal = new web3modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.web3modal(connection);
            const contract = fetchContract(signer);
            const createItem = await contract.createShipment(receiver, 
                new Date(pickupTime).getTime(),
                distance,
                ethers.utils.parsUnits(price, 18),
                ) //timestamp to be converted;
        }
        catch{}
    }
}
