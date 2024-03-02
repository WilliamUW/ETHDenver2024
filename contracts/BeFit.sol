// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract PushUpTracker {
    mapping(address => uint) public pushUps;

    function setPushUps(uint _pushUps) public {
        pushUps[msg.sender] = _pushUps;
    }

    function getPushUps(address _address) public view returns (uint) {
        return pushUps[_address];
    }

    function addPushUps(address _address, uint _pushUps) public {
        pushUps[_address] += _pushUps;
    }
}