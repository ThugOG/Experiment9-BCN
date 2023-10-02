// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserDetails {
    struct User {
        string firstName; // First name of the user (stored as bytes32 for efficiency)
        string lastName; // Last name of the user
        uint age; // Age of the user
        address wallet_address; // Ethereum wallet address of the user
        string ipfsPicture; //Picture of the User
        string certificate_type; // Type of certificate associated with the user
    }

    User[] public noOfRegistrants; // Array to store the registered users

    mapping(address => User) public users; // Mapping to store the user's address to their User struct

    event UserRegistered(
        string firstName,
        string lastName,
        uint age,
        address walletAddress,
        string ipfsPicture,
        string certificateType
    );

    function getDetailsAndStore(
        string memory _firstName,
        string memory _lastName,
        uint _age,
        string memory ipfsPicture,
        string memory _certificate_type
    ) public {
        require(
            users[msg.sender].wallet_address == address(0),
            "User already has data stored."
        ); // Check if the user already has data stored
        noOfRegistrants.push(
            User(_firstName, _lastName, _age, msg.sender, ipfsPicture, _certificate_type)
        ); // Add the user's details to the array
        users[msg.sender] = User(
            _firstName,
            _lastName,
            _age,
            msg.sender,
            ipfsPicture,
            _certificate_type
        ); // Update the user's details in the mapping

        emit UserRegistered(
            _firstName,
            _lastName,
            _age,
            msg.sender,
            ipfsPicture,
            _certificate_type
        );
    }

    function getUserDetails(
        address _userAddress
    )
        public
        view
        returns (string memory, string memory, uint, address, string memory ipfsPicture, string memory)
    {
        require(noOfRegistrants.length > 0, "No users registered."); // Check if there are any registered users
        User memory user = users[_userAddress]; // Get the user details from the mapping
        require(user.wallet_address != address(0), "User does not exist."); // Check if the user exists
        return (
            user.firstName,
            user.lastName,
            user.age,
            user.wallet_address,
            user.ipfsPicture,
            user.certificate_type
        ); // Return the user details
    }
    function getAllUsers() public view returns (User[] memory) {
        return noOfRegistrants;
    }
}
