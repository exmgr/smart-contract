// SPDX-License-Identifier: Apache
pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract EXMWeatherConsumer is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    uint256 public result;
    
    string private weatherGeohash;

    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xe4C58E236C6967922d2F0Dd2d80DCb3F6b1b2f49;
        jobId = "173720e9ef834e3fb5675ec7bc7b6be9";
        fee = 0.1 * 10 ** 18;
        
        // Weather location
        weatherGeohash = "swbb5d";
        
    }
    
    /**
     * Initial request
     */
    function requestWeatherData() public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillWeatherData.selector);
        req.add("geohash", weatherGeohash);
        sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Callback function
     */
    function fulfillWeatherData(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        result = _result;
    }
}