import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import tracking from "../Context/Tracking.json";

const ContractAddress = ""; // Specify your contract address
const ContractABI = tracking.abi;

const fetchContract = (signerOrProvider) => new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
    const DappName = "Product Taking Dapp";
    const [currentUser, setCurrentUser] = useState(null);

    const createShipment = async (items) => {
        console.log(items);
        const { receiver, pickupTime, distance, price } = items;

        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const createItem = await contract.createShipment(
                receiver,
                new Date(pickupTime).getTime(),
                distance,
                ethers.utils.parseUnits(price, 18)
            );
            await createItem.wait();
            console.log(createItem);
        } catch (error) {
            console.log("some Error ", error);
        }
    };

    const getAllShipment = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipments = await contract.getAllTransactions();

            const allShipment = shipments.map((shipment) => ({
                sender: shipment.sender,
                receiver: ethers.utils.formatEther(shipment.price.toString()),
                pickupTime: shipment.pickupTime.toNumber(),
                deliveryTime: shipment.deliveryTime.toNumber(),
                distance: shipment.distance.toNumber(),
                isPaid: shipment.isPaid,
                status: shipment.status,
            }));

            return allShipment;
        } catch (error) {
            console.log("Error getting shipment", error);
        }
    };

    const getShipmentCount = async () => {
        try {
            if (!window.ethereum) return "Please Install the Metamask";
            const account = await window.ethereum.request({
                method: "eth_accounts",
            });

            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipmentCount = await contract.getShipmentCount(account[0]);
            return shipmentCount.toNumber();
        } catch (error) {
            console.log("Error getting the Shipment Count", error);
        }
    };

    const completeShipment = async (completeShipment) => {
        console.log(completeShipment);

        const { receiver, index } = completeShipment;

        try {
            if (!window.ethereum) return "Install Metamask";

            const account = await window.ethereum.request({
                method: "eth_accounts",
            });

            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.completeShipment(
                account[0],
                receiver,
                index,
                {
                    gasLimit: 300000,
                }
            );
            await transaction.wait();
            console.log(transaction);
        } catch (error) {
            console.log("Error completing shipment", error);
        }
    };

    const getShipment = async (index) => {
        console.log(index * 1);
        try {
            if (!window.ethereum) return "Please install Metamask";

            const account = await window.ethereum.request({
                method: "eth_accounts",
            });

            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipment = await contract.getShipment(account[0], index * 1);

            const SingleShipment = {
                sender: shipment[0],
                receiver: shipment[1],
                pickupTime: shipment[2].toNumber(),
                deliveryTime: shipment[3],
                distance: shipment[4].toNumber(),
                price: ethers.utils.formatEther(shipment[5].toString()),
                status: shipment[6],
                isPaid: shipment[7],
            };

            return SingleShipment;
        } catch (error) {
            console.log("No shipment", error);
        }
    };

    // Only called after the Creation of Shipment
    const startShipment = async (getProduct) => {
        const { receiver, index } = getProduct;

        try {
            if (!window.ethereum) return "Install Metamask";
            const account = await window.ethereum.request({
                method: "eth_accounts",
            });

            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const shipment = await contract.startShipment(account[0], receiver, index * 1);

            shipment.wait();
            console.log(shipment);
        } catch (error) {
            console.error("Error starting shipment", error);
        }
    };

    // Checking if Wallet is connected or not
    const checkIfWallectConnected = async () => {
        try {
            if (!window.ethereum) return "Install Metamask First";

            const account = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (account.length) {
                setCurrentUser(account[0]);
            } else {
                return "No account present";
            }
        } catch (error) {
            return "Not connected";
        }
    };

    // Connecting the Wallet
    const connetWallet = async () => {
        try {
            if (!window.ethereum) return "Metamask not present on your system ! , please Install it";

            const account = await window.ethereum.request({
                // click Event
                method: "eth_requestAccounts",
            });
        } catch (error) {
            return "Something went wrong";
        }
    };

    useEffect(() => {
        checkIfWallectConnected();
    }, []);

    return (
        <TrackingContext.Provider
            value={{
                connetWallet,
                createShipment,
                getAllShipment,
                completeShipment,
                getShipment,
                startShipment,
                getShipmentCount,
                DappName,
                currentUser,
            }}
        >
            {children}
        </TrackingContext.Provider>
    );
};
