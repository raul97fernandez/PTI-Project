pragma solidity ^0.4.22;

contract Hashes {
 string ipfshash;
 
 function sendHash(string h) public {
   ipfshash = h;
 }

 function getHash() public view returns (string h) {
   return ipfshash;
 }

}