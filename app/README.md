# Frontend App

The frontend app was created using create-react-app and requires npm and Node.js.

### Dependencies

Before you can start you need to install [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm).

### Installation

If you have successfully installed npm and nodejs, change to `app/` directory and install all dependencies using:

`npm install`

### Environment variables

To run the app, you need to pass the following environment variables:

* `REACT_APP_INFURA_KEY=<YOUR_INFURA_ID>`
* `REACT_APP_RPC_URL=<RPC_URL>`
* `REACT_APP_RPC_PORT=<RPC_PORT>`
* `REACT_APP_NETWORK_ID=<NETWORK_ID>`
* `REACT_APP_LINK_ADDRESS=<LINK_ADDRESS>`
* `REACT_APP_FACTORY_ADDRESS=<INSURANCE_FACTORY_ADDRESS>`

### Start in development mode

To start the app in development mode, you can run:

`npm start`

The app runs on: http://localhost:3000

### Build for production

To build the app for production, run:

`npm run build`

Now you are ready to deploy the project. You can find the production files in `build/` directory.
