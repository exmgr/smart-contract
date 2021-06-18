# Smart Contract Factory & Marketplace

We implemented a smart contract factory mechanism where a (potential) insurance company can fund a ETH wallet with “collateral” and a farmer can create a new “weather protection contract” on his/her own using Metamask and our front-end web app.

New contracts are stored on ETHEREUM blockchain (Kovan via infrura) and their execution is triggered on a daily basis (for the period selected by farmer), via the CHAINLINK node which goes through all the system components, getting weather data from IPFS and 3rd party API, and checking contract conditions to decide if it should be paid, and in such event making the money transfer to farmer’s wallet.

## Web app

The [app](./app) directory contains the source code of a web frontend application, written in React, that facilitates contract creation.

## Contracts

The [contracts](./contracts) directory contains the smart contracts, written in Solidity.

## License

```
Copyright 2020 EXM P.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
