pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract UTMTCrowdsale is Crowdsale, Ownable {
    using SafeMath for uint256;
    uint256 public ethPrice; // in USD
    mapping (address => bool) public isAdmin;
    mapping (address => bool) public isWhiteList;

    constructor (address payable wallet, IERC20 token) public 
        Crowdsale(1, wallet, token) {
    }

    modifier onlyAdmin {
        require(isOwner() || isAdmin[msg.sender]);
        _;
    }


    function updateEthPrice (uint256 _ethPrice) public onlyOwner {
        ethPrice = _ethPrice; 
    }

    function buyTokens(address beneficiary) public  payable {
        require(isWhiteList[msg.sender]);
        super.buyTokens(beneficiary);
    }

    function addToAdmin (address admin, bool isAdd) external onlyOwner {
        isAdmin[admin] = isAdd;
    }

    function addToWhiteList (address whiteList, bool isAdd) external onlyAdmin {
        isWhiteList[whiteList] = isAdd;
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        require (weiAmount >= 10 ** 10);
        return weiAmount.mul(ethPrice).div(10 ** 10);
    }

    function rate() public view returns (uint256) {
        return ethPrice;
    }
}