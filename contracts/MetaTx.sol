// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) external;
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract MetaTx {
    event MetaTransferExecuted(address from, address to, uint256 amount);

    function executeBulkMetaTransferWithPermit(
        address token,
        address to,
        address[] calldata fromList,
        uint256[] calldata amountList,
        uint256[] calldata deadlineList,
        uint8[] calldata vList,
        bytes32[] calldata rList,
        bytes32[] calldata sList
    ) external {
        require(
            fromList.length == amountList.length &&
            fromList.length == deadlineList.length &&
            fromList.length == vList.length &&
            fromList.length == rList.length &&
            fromList.length == sList.length,
            "Length mismatch"
        );

        for (uint256 i = 0; i < fromList.length; i++) {
            // Meta approve işlemi
            IERC20Permit(token).permit(
                fromList[i],
                address(this),
                amountList[i],
                deadlineList[i],
                vList[i],
                rList[i],
                sList[i]
            );

            // Meta transfer işlemi
            require(
                IERC20Permit(token).transferFrom(fromList[i], to, amountList[i]),
                "Transfer failed"
            );

            emit MetaTransferExecuted(fromList[i], to, amountList[i]);
        }
    }
}


















