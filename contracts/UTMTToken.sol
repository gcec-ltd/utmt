pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

contract UTMT is ERC20, ERC20Detailed, Ownable{
    mapping (address => bool) public isAdmin;
    
    constructor () public ERC20Detailed('UTime Token', 'UTMT', 6) {
    	uint256 _totalSupply = (10 ** 9) * (10 ** 6);
    	_mint(msg.sender, _totalSupply);
    }

    modifier onlyAdmin {
        require(isOwner() || isAdmin[msg.sender]);
        _;
    }

    function addToAdmin (address admin, bool isAdd) external onlyOwner {
        isAdmin[admin] = isAdd;
    }

    function burn(uint256 amount) public onlyAdmin {
        _burn(msg.sender, amount);
    }
}
