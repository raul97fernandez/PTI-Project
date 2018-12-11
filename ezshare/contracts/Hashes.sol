pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./Strings.sol";


contract Hashes {

  using Strings for *;

  struct User {
    address account;
    string name;
    string passwd;
    string[] files;
    bool active;
  }

  User[] users_;
  mapping (address => User) addressToUser_;
  mapping (string => User) usernameToUser_;

  // @dev Hashes.deployed().then(function(instance){return instance.userEnrollment('raul', 'xd')})
  function userEnrollment(string _user, string passwd) public {
    //Comprovar que no existeixi un user amb aquesta adreça ni amb aquest nom
    require(keccak256(addressToUser_[msg.sender].name) == keccak256(""));

    for (uint i = 0; i < users_.length; ++i) {
      require(keccak256(_user) != keccak256(users_[i].name));
    }

    string[] memory files;
    User memory newUser = User(msg.sender, _user, passwd, files, false);
    users_.push(newUser);
    addressToUser_[msg.sender] = newUser;
    usernameToUser_[_user] = newUser;
  }

  // @dev Hashes.deployed().then(function(instance){return instance.addFile('983umskjdsfh892hfy89hf8d9sh')})
  //Afegir fitxer
  function addFile(string _hash) public {
    //Caldria comprovar que el hash no conte '/'
    User storage user = addressToUser_[msg.sender];
    User storage user_names = usernameToUser_[user.name];
    //Comprovem que l'usuari s'ha loggejat
    require(user.active);//, 'You cannot add a file without logging in');
    user.files.push(_hash);
    user_names.files.push(_hash);

  }

  // @dev Hashes.deployed().then(function(instance) { return instance.getMyUserName() } )
  function getMyUserName() public view returns (string) {
    string memory username = addressToUser_[msg.sender].name;
     if (keccak256(username) == keccak256("")) {
      return "";
    }
    return username;
  }

  // @dev Hashes.deployed().then(function(instance) { return instance.getFilesFromUser() })
  // Retorna tots els fitxers que pertanyen a aquest usuari
  function getFilesFromUser() public view returns (string) {
    string memory returnValue = "No files";
    User storage user = addressToUser_[msg.sender];
    // L'usuari ha d'estar loggejat
    require(user.active);
    for (uint256 i = 0; i < user.files.length; ++i) {
      if (i == 0) {
        returnValue = user.files[i].toSlice().concat("/".toSlice());
      } else {
        string memory inter = user.files[i].toSlice().concat("/".toSlice());
        returnValue = returnValue.toSlice().concat(inter.toSlice());
      }
    }
    return returnValue;
  }

  // @dev Hashes.deployed().then(function(instance) { return instance.login( 'xd' ) })
  // Per fer login del usuari
  function login(string passwd) public {
    User storage user = addressToUser_[msg.sender];
    // Per poder fer login l'usuari no ha d'estar loggejat
    require(!user.active);
    require(keccak256(user.passwd) == keccak256(passwd));
    user.active = true;
  }

  // @dev Hashes.deployed().then(function(instance) { return instance.logout() })
  // Per fer logout del usuari
  function logout() public {
    User storage user = addressToUser_[msg.sender];
    // Per poder fer logout l'usuari ha d'estar loggejat
    require(user.active); 
    user.active = false;
  }

  function shareHash(string _userToShare, string _hash) public {
    User storage userOwner = addressToUser_[msg.sender];
    // Per poder compartir un hash has d'estar loggejat
    require(userOwner.active);
    bool found = false;
    for (uint i = 0; i < userOwner.files.length; ++i) {
      if (keccak256(userOwner.files[i]) == keccak256(_hash)) {
        found = true;
      } 
    }
    // Per poder compartir un hash l'usuari ha de tenir el hash
    require(found);
    User storage user2Share = usernameToUser_[_userToShare];
    require(keccak256(user2Share.name) != keccak256(""));
    user2Share.files.push(_hash);
    User storage user2 = addressToUser_[user2Share.account];
    // Per poder compartir un hash amb un usuari aquest ha d'existir
    require(keccak256(user2.name) != keccak256(""));
    user2.files.push(_hash);
  }

}
