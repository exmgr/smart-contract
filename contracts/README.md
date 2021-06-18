# Smart Contracts

To deploy the smart contracts you can use for example the [Remix IDE](https://remix.ethereum.org/).

### Before you start

Make sure that the address of your chainlink node `CL_NODE` and the LINK token addess `LINK_ADDRESS` in `ICFactory.sol` and `InsuranceContract.sol` are correct.

### Deploy the contracts

You have to deploy the contracts from the `contracts/` directoryin the following order:

##### 1. Oracle.sol

First deploy the Oracle.sol
After deploy, call the `setFulfillmentPermission` method with the `_node` **address** of you chainlink node and set `_allowed` to **true**.

##### 2. Adding oracle address to InsuranceContract.sol

Set the `oracle` variable in `InsuranceContract.sol` to your new oracles **address**.

_You don't need to deploy this contract!_

#### 3. ICFactory.sol
Add your needed chainlink jobs in the `initJobs()` function and deploy `ICFactory.sol`.

