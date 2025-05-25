// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract MetaTx {
    mapping(address => uint256) public nonces;

    bytes32 private constant META_TX_TYPEHASH = keccak256(
        "MetaTransaction(address token,uint256 nonce,address from,address to,uint256 amount)"
    );

    bytes32 private constant BULK_META_TX_TYPEHASH = keccak256(
        "BulkMetaTransaction(address token,uint256 nonce,address from,address[] to,uint256[] amount)"
    );

    function getDigest(
        address token,
        uint256 nonce,
        address from,
        address to,
        uint256 amount
    ) public pure returns (bytes32) {
        return keccak256(
            abi.encode(
                META_TX_TYPEHASH,
                token,
                nonce,
                from,
                to,
                amount
            )
        );
    }

    function getBulkDigest(
        address token,
        uint256 nonce,
        address from,
        address[] memory toList,
        uint256[] memory amountList
    ) public pure returns (bytes32) {
        return keccak256(
            abi.encode(
                BULK_META_TX_TYPEHASH,
                token,
                nonce,
                from,
                keccak256(abi.encodePacked(toList)),
                keccak256(abi.encodePacked(amountList))
            )
        );
    }

    function executeMetaTransaction(
        address token,
        address from,
        address to,
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        uint256 nonce = nonces[from];
        bytes32 digest = getDigest(token, nonce, from, to, amount);
        address signer = ecrecover(digest, v, r, s);
        require(signer == from, "Invalid signer");

        nonces[from]++;
        require(IERC20(token).transferFrom(from, to, amount), "Transfer failed");
    }

    function executeMetaTransactionBulk(
        address token,
        address from,
        address[] calldata toList,
        uint256[] calldata amountList,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(toList.length == amountList.length, "Length mismatch");

        uint256 nonce = nonces[from];
        bytes32 digest = getBulkDigest(token, nonce, from, toList, amountList);
        address signer = ecrecover(digest, v, r, s);
        require(signer == from, "Invalid signer");

        nonces[from]++;
        for (uint256 i = 0; i < toList.length; i++) {
            try IERC20(token).transferFrom(from, toList[i], amountList[i]) returns (bool ok) {
                require(ok, string(abi.encodePacked("TransferFrom returned false at index ", Strings.toString(i))));
            } catch Error(string memory reason) {
                revert(string(abi.encodePacked("TransferFrom reverted with reason at index ", Strings.toString(i), ": ", reason)));
            } catch {
                revert(string(abi.encodePacked("TransferFrom reverted silently at index ", Strings.toString(i))));
            }
        }
    }

    function debugSigner(bytes32 digest, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(digest, v, r, s);
    }
}
















