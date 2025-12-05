// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract QuickPay {
    IERC20 public acceptedToken;

    event PaymentMade(address indexed payer, address indexed seller, uint256 amount, string paymentRef);

    constructor(address _tokenAddress) {
        acceptedToken = IERC20(_tokenAddress);
    }

    function payMerchant(address _seller, uint256 _amount, string memory _paymentRef) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_seller != address(0), "Invalid seller address");

        // Transfer funds directly from buyer to seller
        // The buyer must have approved this contract to spend the tokens
        bool success = acceptedToken.transferFrom(msg.sender, _seller, _amount);
        require(success, "Transfer failed");

        emit PaymentMade(msg.sender, _seller, _amount, _paymentRef);
    }
}
