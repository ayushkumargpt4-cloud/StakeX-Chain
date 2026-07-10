// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AdvancedToken {

    string public name = "Advanced Token";
    string public symbol = "ADT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    bool public paused;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    mapping(address => bool) public blacklisted;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event Pause();
    event Unpause();
    event Blacklisted(address indexed user);
    event RemovedFromBlacklist(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    modifier notBlacklisted(address account) {
        require(!blacklisted[account], "Blacklisted");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply = initialSupply * 10 ** decimals;
        balances[msg.sender] = totalSupply;

        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function balanceOf(address account) public view returns(uint256){
        return balances[account];
    }

    function allowance(address tokenOwner, address spender) public view returns(uint256){
        return allowances[tokenOwner][spender];
    }

    function transfer(address recipient, uint256 amount)
        public
        whenNotPaused
        notBlacklisted(msg.sender)
        notBlacklisted(recipient)
        returns(bool)
    {
        require(recipient != address(0), "Zero address");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);

        return true;
    }

    function approve(address spender, uint256 amount)
        public
        whenNotPaused
        notBlacklisted(msg.sender)
        returns(bool)
    {
        allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    )
        public
        whenNotPaused
        notBlacklisted(sender)
        notBlacklisted(recipient)
        returns(bool)
    {
        require(balances[sender] >= amount, "Balance low");
        require(allowances[sender][msg.sender] >= amount, "Allowance low");

        allowances[sender][msg.sender] -= amount;
        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

        return true;
    }

    function mint(address to, uint256 amount)
        public
        onlyOwner
    {
        require(to != address(0), "Zero address");

        uint256 mintAmount = amount * 10 ** decimals;

        totalSupply += mintAmount;
        balances[to] += mintAmount;

        emit Mint(to, mintAmount);
        emit Transfer(address(0), to, mintAmount);
    }

    function burn(uint256 amount)
        public
    {
        uint256 burnAmount = amount * 10 ** decimals;

        require(balances[msg.sender] >= burnAmount, "Not enough");

        balances[msg.sender] -= burnAmount;
        totalSupply -= burnAmount;

        emit Burn(msg.sender, burnAmount);
        emit Transfer(msg.sender, address(0), burnAmount);
    }

    function pause() public onlyOwner {
        paused = true;
        emit Pause();
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpause();
    }

    function blacklist(address user) public onlyOwner {
        blacklisted[user] = true;
        emit Blacklisted(user);
    }

    function removeBlacklist(address user) public onlyOwner {
        blacklisted[user] = false;
        emit RemovedFromBlacklist(user);
    }

    function transferOwnership(address newOwner)
        public
        onlyOwner
    {
        require(newOwner != address(0), "Zero address");

        emit OwnershipTransferred(owner, newOwner);

        owner = newOwner;
    }

    function withdrawETH() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}