pragma solidity ^0.6.6;

contract BallsReward {
    using SafeMath for uint;

    address public ballsToken;
    address public router;
    
    address public owner;
    uint public totalAllocPoint;
    uint public firstBlockNumber = block.number;
    uint public ballPerReward = 137500 ether;
    uint public monthBlockNumber = 200000;
    
    
    address public devAddr ;

    constructor (address _ballsToken,address _router) public {
        ballsToken = _ballsToken;
        router = _router;
        devAddr = msg.sender;
        owner = msg.sender;
    }
    
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    modifier onlyRouter() {
        require(router == msg.sender);
        _;
    }
    
    function setOwner (address _owner) public onlyOwner {
        owner = _owner;
    }
    function setDevAddr(address _devAddr) public onlyOwner{
        devAddr = _devAddr;
    }
    
    function setRouter(address _router) public onlyOwner{
        router = _router;
    }
    
    mapping(address => uint) public poolInfo;
    mapping(uint => uint) public periodIdAllocPoint;
    mapping(uint => uint) public periodIdReward;

    mapping(address => mapping(address => mapping(uint => uint))) public pairUserPeriodAmount;
    mapping(address => mapping(uint => uint)) public pairPeriodAmount;
    mapping(address => mapping(address => uint)) public userWithdraw;
  
    function add(uint256 _allocPoint, address _lpToken) public onlyOwner {
        require(poolInfo[_lpToken]==0);
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo[_lpToken] = _allocPoint;
        setPeriodReward();
    }
    
    
    function set(address _pair, uint256 _allocPoint) public onlyOwner {
        require(poolInfo[_pair] >0);
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pair]).add(_allocPoint);
        poolInfo[_pair] = _allocPoint;
        setPeriodReward();
    }
    function setBallsTokenNewOnwer(address _newBallsTokenOwner) public onlyOwner {
        IBallsToken(ballsToken).transferOwnership(_newBallsTokenOwner);
    }

    function getReward(address _pair) public {
        setPeriodReward();
        (uint _reward ,)= viewReward(_pair,msg.sender,true);
        require(_reward > 0);
        if(block.number.sub(firstBlockNumber) <= monthBlockNumber*26){
            IBallsToken(ballsToken).mint(devAddr, uint(_reward.div(11)));
        }
        IBallsToken(ballsToken).mint(msg.sender, uint(_reward.mul(10).div(11)));
        userWithdraw[_pair][msg.sender] = getCurrentPeriodId();
    }
    
    function viewReward(address _pair,address _sender,bool _flag) public view returns(uint,uint){
        uint totalReward ;
        uint userTradeAmount;
        uint endId = getCurrentPeriodId();
        if(_flag){
            endId = getCurrentPeriodId().sub(1);
        }
        for(uint i= userWithdraw[_pair][_sender];i<= endId;i++){
            uint _userTrade = pairUserPeriodAmount[_pair][_sender][i];
            if(_userTrade >0){
                userTradeAmount = userTradeAmount.add(_userTrade);
                uint _pairTradeAmount = pairPeriodAmount[_pair][i];
                uint _periodAlloc = periodIdAllocPoint[i];
                uint _alloc = poolInfo[_pair];
                if(_pairTradeAmount>0 && _periodAlloc>0 && _alloc>0){
                    uint _accPerBalls =  periodIdReward[i].mul(_alloc).mul(1e12).div(_periodAlloc).div(_pairTradeAmount);
                    if(_accPerBalls>0){
                        totalReward = totalReward.add(_userTrade.mul(_accPerBalls).div(1e12));
                    }
                }
            }
        }
        return (totalReward,userTradeAmount);
        
    }
    
    
    function getNewBallsReward() public view returns(uint){
        if(block.number.sub(firstBlockNumber) >= monthBlockNumber && block.number.sub(firstBlockNumber) < monthBlockNumber*7){
            return ballPerReward.div(2);
        }else if(block.number.sub(firstBlockNumber) >= monthBlockNumber*7 && block.number.sub(firstBlockNumber) < monthBlockNumber*12){
            return ballPerReward.div(2**2);
        }else if(block.number.sub(firstBlockNumber) >= monthBlockNumber*12 && block.number.sub(firstBlockNumber) < monthBlockNumber*17){
            return ballPerReward.div(2**3);
        }else if(block.number.sub(firstBlockNumber) >= monthBlockNumber*17 && block.number.sub(firstBlockNumber) < monthBlockNumber*22){
            return ballPerReward.div(2**4);
        }else if(block.number.sub(firstBlockNumber) >= monthBlockNumber*22 && block.number.sub(firstBlockNumber) <= monthBlockNumber*26){
            return ballPerReward.div(2**5);
        }else if(block.number.sub(firstBlockNumber) > monthBlockNumber * 26 ){
            return ballPerReward.div(2**6);
        }else{
            return ballPerReward;
        }
    }

    function setPeriodReward() public {
        periodIdReward[getCurrentPeriodId()] = getNewBallsReward();
        periodIdAllocPoint[getCurrentPeriodId()] = totalAllocPoint;
    }
    
    function getCurrentPeriodId() public view returns (uint){
        return uint(block.number.sub(firstBlockNumber)/500)+1;
    }
    function setPairUserPeriodAmount(address _pair,address _sender,uint _amount) external onlyRouter{
        uint _per = getCurrentPeriodId();
        pairUserPeriodAmount[_pair][_sender][_per] = pairUserPeriodAmount[_pair][_sender][_per].add(_amount);
        pairPeriodAmount[_pair][_per] = pairPeriodAmount[_pair][_per].add(_amount);
        setPeriodReward();
        if(userWithdraw[_pair][_sender] ==0 ){
            userWithdraw[_pair][_sender]=1;
        }
    }
    function getTotalAllocPoint() public view returns(uint){
        return totalAllocPoint;
    }
    
}

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, 'ds-math-add-overflow');
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, 'ds-math-sub-underflow');
    }

    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
    }
    
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }
}

interface IBallsToken {
    function mint(address,uint) external;
    function transferOwnership(address) external;
}
interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}