pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/math/SafeMath.sol";


// to do: add events, test everything, chainlink integration

// interface of contract factory to trigger payout
interface iICFactory {
    function payout(bool) external;
}

// ERC 20 interface for LINK token
interface iERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// Insurance Contract
contract Insurance is ChainlinkClient {
    using SafeMath for uint256;
    
    address CL_NODE = 0xc47e0FBdf1d71Dfe58cD403A582916A52E3d707f; // Chainlink node address
    address private LINK_ADDRESS = 0xa36085F69e2889c224210F603D836748e7dC0088;  // kovan LINK token address
    
    iERC20 link = iERC20(LINK_ADDRESS); // link token contract instance
    
    address private oracle = 0xB84be727Ff04B64D5f85e0a669Af0ef8e14f530B;   // exm oracle address
    uint256 private fee = 0.1 * 10 ** 18; // 0.1 LINK
    
    
    address payable public creator;     // creator of the insurance (farmer)    
    address payable public icFactory;   // address of the insurance factory

    string public location;              // weather adapter station
    
    uint256 public crop;                // ensured crop in Wei
    uint256 public weatherCondition;    // ensured weather condition
    uint256 public weatherConMin;       // weather condition threshold min
    uint256 public weatherConMax;       // weather condition threshold max
    uint256 public creationDate;        // date of contract creation
    uint256 public endDate;             // end date of insurance
    uint256 public threshold;           // threshold of weather condition
    
    bool public isActive;               // true = insurance is active, false = insurance isn't active
    
    iICFactory public factory;          // contract instance of insurance factory 
    
    struct RequestData {                // stores history values of requested data
        uint256 date;
        uint256 value;
    }
    
    struct Job {                        // stores job informations
        string name;
        bytes32 jobId;
        string source;
    }
    
    RequestData[] public requestHistory;    // list of weather data history
    Job[] private jobIds;                   // list of products/jobs
    uint256 public counter;                 // counts chainlink requests
    uint256 public tempResult;              // temporary chianlink result for average calculation
    
    // modifier for function which can only called by factory contract
    modifier onlyIcFactory() {
        require(msg.sender == icFactory, 'msg.sender is not allowed');
        _;
    }
    
    // modifier for functions that can only called by exm chainlink node
    modifier onlyCLNode() {
        require(msg.sender == CL_NODE, 'msg.sender is not allowed');
        _;
    }
    
    constructor (
            address payable creator_,       // address of insurance creator
            string memory location_,        // location of weather station
            uint256 crop_,                  // ensured crop in Wei
            uint256 weatherCondition_,      // wensured eather condition
            uint256 durationMonth_,         // month of the insurance period
            uint256 threshold_ ) public {   // threshold of weather condition
        
        setPublicChainlinkToken();          // sets chainlink token address
                
        creator = creator_;
        icFactory = payable(msg.sender);
        location = location_;
        crop = crop_;
        weatherCondition = weatherCondition_;            // input value * 100. --> instead of 42.42 degree input should be 4242
        endDate = block.timestamp.add(durationMonth_.mul(4 weeks)); // sets end date of insurance
        creationDate = block.timestamp;
        threshold = threshold_;
        factory = iICFactory(icFactory);    // insurance contract factory instance
        counter = 0;            // sets the chainlink job counter to zero
        isActive = true;        // activates the contract
        
        // weatherConMin, weatherConMax
        // values at which the insurance takes effect
        uint256 weatherConDiff = (weatherCondition.mul(threshold)).div(100);
        weatherConMin = weatherCondition.sub(weatherConDiff);
        weatherConMax = weatherCondition.add(weatherConDiff);
    }
    
    function getIsActive() external view returns(bool) {
        return isActive;
    }
    
    function getCreator() external view returns(address) {
        return creator;
    }
    
    // checks if the current weather value is greater than or less than the specified threshold
    function isInsuranceCase(uint256 latestValue) internal view returns(bool) {
        return (latestValue > weatherConMax || latestValue < weatherConMin);
    }
    
    // checks that the contract period has not yet been exceeded.
    function isPeriod() internal view returns(bool) {
        return (endDate >= block.timestamp);
    }
    
    // ends the insurance contract
    // @param insuranceCase true if insurance case, false if no insurance case
    function endContract(bool insuranceCase) internal {
        isActive = false;
        payBackLink();
        factory.payout(insuranceCase);
    }
    
    // for paying back link to insurance factory after contract ends
    function payBackLink() internal {
        link.transfer(icFactory, link.balanceOf(address(this)));
    }
    
    // request weather data
    // executes Chainlink jobs
    function sendRequest() external onlyIcFactory {
        requestHistory.push(RequestData(block.timestamp, 0));       // saves date of request to history
        counter = 0;
        tempResult = 0;
        // sends a chainlink request for every job in list
            for(uint256 i; i<jobIds.length; i++) {
                // new chainlink request
                Chainlink.Request memory req = buildChainlinkRequest(jobIds[i].jobId, address(this), this.checkInsuranceCase.selector);
                
                // adding location to request, if requested adapter is openweathermap adapter
                if(keccak256(abi.encodePacked(jobIds[i].source )) == keccak256(abi.encodePacked('owm'))) 
                    req.add("city", location);
                    
                // adding 'swbb5d' geohash to request, if requested adapter is exm adapter
                if(keccak256(abi.encodePacked(jobIds[i].source )) == keccak256(abi.encodePacked('exm'))) 
                    req.add('geohash', 'swbb5d');
                
                //sends chainlink request
                sendChainlinkRequestTo(oracle, req, fee);
            }
    }
    
    // add a new chainlink job to contract
    // can only called by insurance contract factory (while contract creation)
    function addJob(string calldata name, bytes32 jobId, string calldata source) external onlyIcFactory {
        jobIds.push(Job(name, jobId, source));
    }
    
    // Checks whether an insured event has occurred or the term has been exceeded.
    // If the term is exceeded, the factory contract gets its funds back.
    // If an insured event occurs, the creator of the contract receives the insured amount.
    function checkInsuranceCase(bytes32 _requestId, uint256 externalValue) public recordChainlinkFulfillment(_requestId) {
        require(isActive, 'contract is no longer active');
        
        // counts the number of chainlink request results
        counter++;
        
        // adding all results to temporary result
        tempResult += externalValue;
        
        if(counter==jobIds.length) {
            // calculate the average 
            uint256 average = tempResult.div(jobIds.length);
            // add average of latest values to history
            requestHistory[requestHistory.length-1].value = average;
            
            // checks insurance conditions
            if(isPeriod()) {
                if(isInsuranceCase(average)) {
                    endContract(true);          // its an insurance case
                }
            } else {
                endContract(false);             // insurance period is over, it is no insurance case
            }
        }
    }
    
    function getCrop() external view returns (uint256) {
        return crop;
    }
    
    // returns state values
    function getAllContractData() public view 
        returns(address payable,    // creator
                address payable,    // icFactory
                Job[] memory,       // jobIds
                string memory,      // location
                uint256,            // crop
                uint256,            // endDate 
                uint256,            // creation date
                uint256,            // threshold 
                uint256,            // weatherCondition 
                uint256,            // weatherConMax
                uint256,            // weatherConMin
                bool,               // isActive
                RequestData[] memory) {
        return(creator, icFactory, jobIds, location, crop, creationDate, endDate, threshold, 
                weatherCondition, weatherConMax, weatherConMin, isActive, requestHistory);
    }
    
    function getBaseData() public view returns (address, address, uint256, Job[] memory, bool) {
        return(creator, icFactory, creationDate, jobIds, isActive);    
    }
    
    // dev functions
    
    function setEndDateNow() external onlyIcFactory {
        endDate = block.timestamp;
    }
}