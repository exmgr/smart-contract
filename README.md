# Contract
Solidity contract to obtain weather data from IPFS via oracle adapter.

## Setting up oracle contract and adapter
Use [Remix](https://remix.ethereum.org) Web IDE to deploy and test contracts.
1. Deploy Oracle contract in ```Oracle.sol```
1. On the deployed contract call setFulfillmentPermission with the parameters ```[your chainlink node address], true```
1. Create bridge in Chainlink node named "weather", pointing to the URL of the adapter (```ipfs-middleware``` repository)
1. Create job and use definition from ```jobspec.json```, setting the ```address``` key to the address of the newly deployed oracle.

## Setting up and deploying contract

1. Populate EXMWeatherConsumer contract variables:
    * **oracle** Address of the above deployed oracle contract.
    * **jobId** ID of job created above.
    * **weatherGeohash** Geohash of weather station used as data source.
1. Fund deployed contract with 0.1 LINK.
1. Once the contract is deployed, call ```requestWeatherData()``` on it
1. Wait for confirmation, once it is finished, click "result" and the contract returns the  ```Wind Gust``` parameter of the weather station (multiplied by 100 in m/S).