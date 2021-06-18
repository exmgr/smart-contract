pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './InsuranceContract.sol';
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/math/SafeMath.sol";

// to do: add events, test everything, comments

// Insurance Contract Factory - Contract
contract ICFactory {
    using SafeMath for uint256;
    
    address private LINK = 0xa36085F69e2889c224210F603D836748e7dC0088; // LINK token on kovan
    address public CL_NODE = 0xc47e0FBdf1d71Dfe58cD403A582916A52E3d707f; // Chainlink node address
    uint256 private fee = 0.1 * 10 ** 18; // 0.1 LINK
    
    iERC20 link = iERC20(LINK);     // LINK token contract instance
    
    // Job struct
    // stores job informations
    struct Job {                        // stores job informations
        string name;
        bytes32 jobId;
        string source;
    }

    struct BaseData {
        address insurace;
        address creator;
        address factory;
        uint256 creationDate;
        Insurance.Job[] joblist;
        bool isActive;
    }
    
    mapping(bytes32 => string) public jobKeys;
    
    // admin mapping stores addresses with admin privileges
    mapping (address => bool) public admins;
    
    // userList mapping stores all contract addresses of an user
    mapping (address => address[]) public contractlist;
    
    // mapping of active and not paid contracts
    mapping (address => bool) public notPaid;
    
    // jobIds stores all job informations
    mapping (string => Job) internal jobIds;
    
    // stores the amount of all ensured crop balances
    uint256 public ensuredBalance;

    address[] public allContracts;
    
    // function modifier for functions that should only accessed by exm chainlink node or an admin 
    modifier onlyCLNode() {
        require(msg.sender == CL_NODE || admins[msg.sender], 'msg.sender is not allowed');
        _;
    }
    
    // constructor, initializes msg.sender as admin and ensuredBalance with zero
    constructor () public {
        admins[msg.sender] = true;
        ensuredBalance = 0;
        initJobs();
    }
    
    function initJobs() internal {
        addJob("EXM Wind", 0x5a3a3798b3da4dc197348b134f407d7600000000000000000000000000000000, 'exm');
        addJob("Openweathermap Wind", 0xbf59f63cc8394239877a785f3fc673ca00000000000000000000000000000000, "owm");
        addJob("EXM Temperature", 0xec79e0cf90004bdaa58629093c8d32d200000000000000000000000000000000, "exm");
        addJob("Openweathermap Temperature", 0x459c08dbe92d4a90ba9baf0a89c08ee700000000000000000000000000000000, "owm");
    }
    
    // creates a new contract
    // insuranceProducts: string array of insurance job names
    // location: location of weather station
    // crop: ensured crop balance in Wei 
    // weatherCondition: example weather condition * 100. Example: 24.12 Degrees Celsius = 2412
    // durationMonth: how long the insurance period shoud be. For example 3 for 3 Month
    // threshold: Threshold of weatherCondition
    // ensuredBy: e.g. 10 for 10% - 10% of the crop amount has to be paid with contract creation
    // cronInterval: how often the cron jobs runs, for example: 1 for once a day
    function createNewContract(
                string[] memory insuranceProducts, string memory location, uint256 crop, uint256 weatherCondition, 
                uint durationMonth, uint threshold, uint ensureBy, uint256 cronInterval) public payable returns (address) {
        // 30 days * cron_interval * n Month * 0.1 LINK + 0.5 extra_link
        uint256 length = insuranceProducts.length;
        uint256 needed_link = (length.mul(fee.mul(durationMonth.mul(cronInterval.mul(30))))).add(0.5 ether);
       
        // check all balances
        require(address(this).balance - ensuredBalance >= crop, 'contract has not enough balance');
        require(msg.value == ensureBy.mul(crop.div(100)), 'contract has not enough ether');
        require(link.balanceOf(address(this)) >= needed_link, 'contract has not enough link');
       
        // create new contract with given values
        Insurance newContract = new Insurance(payable(msg.sender), location, crop, weatherCondition, durationMonth, threshold);
        address newAddress = address(newContract);
        allContracts.push(newAddress);
        // adding existing jobs to new contract
        for(uint256 i; i<length; i++) {
            string memory product = insuranceProducts[i];
            require(jobIds[product].jobId != 0x0000000000000000000000000000000000000000000000000000000000000000, 'invalid job');
            newContract.addJob(product, jobIds[product].jobId, jobIds[product].source);
        }
        
        // adding contract to contract lists
        contractlist[address(this)].push(newAddress);
        contractlist[msg.sender].push(newAddress);
        notPaid[newAddress] = true;
        
        // add the crop to the ensured balance
        ensuredBalance = ensuredBalance.add(crop);
        
        // transfer link to new contract
        link.transfer(newAddress, needed_link);

        return newAddress;
    }
    
    // transfer insurance amount to address
    function transferInsuranceAmount(uint256 amount, address to) internal {
        payable(to).transfer(amount);
    }
    
    // pays contract creator in case of insurance
    // or release the ensured balance
    function payout(bool insuranceCase) external {
        bool isActive = Insurance(msg.sender).getIsActive();
        uint256 cCrop;          // ensured crop (contract crop)
        
        // get ensured crop informations if its already paid
        cCrop = Insurance(msg.sender).getCrop();
        
        // security checks
        require(!isActive, 'contract is active');                       // contract has to be active
        require(notPaid[msg.sender], 'contract ended or does not exist');  // contract must be in active list
        require(address(this).balance >= cCrop, 'not enough balance');  // factory contract must have enough ether
        
        // ended=true & prevent reentrancy attack
        notPaid[msg.sender] = false;
        
        // reduce the ensured balance by the ensured crop amount (release ensured crop amount)
        ensuredBalance = ensuredBalance.sub(cCrop);
        
        // in case of insurance, transfers ensured crop amount to contract creator
        if(insuranceCase) { 
            transferInsuranceAmount(cCrop, Insurance(msg.sender).getCreator());
        }
    }
    
    // for executing the chainlink cron job
    // iteratres over the contract list and executes the contracts method for chainlink request
    function executeCronTask() public onlyCLNode {
        for(uint256 i; i < allContracts.length; i++) {
            address insurance = allContracts[i];
            if(notPaid[insurance] == true) {
                Insurance(insurance).sendRequest();            
            }
        }
    }
    
    // receive payments
    receive() external payable {}
    
    // set a new job - only admin
    // name of job, e.g.: "exm-temp"
    // jobId of job, e.g.: 0x73942961215a4238bbde5bb6f0b81b3000000000000000000000000000000000 (0x<job id><32*0>)
    function setJob(string memory name, bytes32 jobId, string memory source) public {
        require(admins[msg.sender] == true, 'you are not allowed');
        addJob(name, jobId, source);
    }
    
    function addJob(string memory name, bytes32 jobId, string memory source) internal {
        jobIds[name] = Job(name, jobId, source);
        jobKeys[jobId] = name;
    }
    
    
    // withdrawing the not ensured balance - only admin
    function withdrawNotEnsuredBalance() public {
        require(admins[msg.sender] == true, 'you are not allowed');
        payable(msg.sender).transfer(address(this).balance - ensuredBalance);
    }
    
    //
    // dev functions
    //
    
    // add a new admin to admin mapping
    function setAdmin(address admin_) public {
        require(admins[msg.sender] == true, 'you are not allowed');
        admins[admin_] = true;
    }
    
    // remove an admin from admin mapping
    function removeAdmin(address admin_) public {
        require(admins[msg.sender] == true, 'you are not allowed');
        admins[admin_] = false;
    }
    
    // withdraw all eth and link
    function withdrawAll() public {
        require(admins[msg.sender] == true, 'you are not allowed');
        payable(msg.sender).transfer(address(this).balance);
        link.transfer(msg.sender, link.balanceOf(address(this)));
    }
    
    // get eth balance
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
    
    // sets the end date of a cntract to now
    function setEndDateNow(address cAddress) external {
        require(admins[msg.sender] == true, 'you are not allowed');
        Insurance(cAddress).setEndDateNow();
    }
    
    // remove job from list
    function removeJobId(string memory name) public {
        require(admins[msg.sender] == true, 'you are not allowed');
        delete jobIds[name];
    }
    
    function getBaseData(address insurance) public view returns(BaseData memory) {
        (address creator, address factory, uint256 creationDate, Insurance.Job[] memory joblist, bool isActive) = Insurance(insurance).getBaseData();
    
        BaseData memory bd = BaseData(insurance, creator, factory, creationDate, joblist, isActive);
            
        return bd;            
    }
                
    //get all contracts from user list
    function getContractEntries(address user) public view returns(BaseData[] memory) {
       BaseData[] memory list = new BaseData[](contractlist[user].length);
        
        for(uint i = 0; i < contractlist[user].length; i++) {
            list[i] = getBaseData(contractlist[user][i]);
        }
        
        return list;
    }
    
}