// SPDX-License-Identifier: Apache
pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract ChainlinkTesting is ChainlinkClient {
    address private oracle;
    bytes32[] public jobId;
    uint256 private fee;
    uint256 public counter;
    
    uint256 public result;
    uint256 public finalResult;
    
    string private location;

    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x79E189Af1Ee7CE4BE5E3918CDBC20b2b070A1cd4;
        fee = 0.1 * 10 ** 18;
        //jobId = 0xfdf32c6971cd4a9fa16f9354a5fef0e500000000000000000000000000000000;
        // Weather location
        location = "boston";
        counter = 0;
    }
    
    function setJobId(bytes32 jobId_) public {
        jobId.push(jobId_);
    }
    
    function setLocation(string memory location_) public {
        location = location_;
    }
    
    function setJobArray(bytes32[] memory jobArray) public {
        jobId = jobArray;
    }
    
    function setJobs() public {
        jobId.push(0x9d878a543db34d3292353cd7b9eed9ef00000000000000000000000000000000);
        jobId.push(0x716ff7863aeb4c6abc119e265eaf6ee500000000000000000000000000000000);
    }
    
    /**
     * Initial request
     */
    function requestWeatherData() public {
        counter = 0;
        result = 0;
        for(uint256 i; i<jobId.length; i++) {
            Chainlink.Request memory req = buildChainlinkRequest(jobId[i], address(this), this.something.selector);
            if(i==1) req.add("city", location);
            if(i==0) req.add('geohash', 'swbb5d');
            sendChainlinkRequestTo(oracle, req, fee);
        }
    }
    
    /**
     * Callback function
     */
    function something(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        result += _result;
        counter++;
        if(counter==jobId.length) {
            finalResult = result/jobId.length;
        }
    }
}