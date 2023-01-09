/// SPDX-License-Identifier: MIT
pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;
contract BlindAuction {
    // Structure to store information about an auction
    struct AuctionInfo {
        uint id;
        string item_name;
        uint start_price;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
		address[] participants;
        uint[] bids;
    }

    // Mapping from auction ID to auction information
    mapping(uint => AuctionInfo) public auctions;

    // Array to store all auction IDs
    uint[] public auctionIds;

    // Counter for generating unique auction IDs
    uint public auctionCounter;

    // Mapping from auction ID to the address of the auction creator
    mapping(uint => address) public auctionCreators;
 	mapping(uint => mapping(address => bool)) public auctionParticipants;



    // Create an auction
    function auctionItem(string memory _item_name, uint _start_price, uint _bidding_time) public {
        // Generate a unique ID for the auction
        uint id = auctionCounter++;
        // Calculate the end date for the auction in seconds
        uint auctionEndTime = block.timestamp + _bidding_time;
        // Store the auction information in the mapping
        auctions[id] = AuctionInfo(id, _item_name, _start_price, auctionEndTime, address(0), 0, new address[](0), new uint[](0));
        // Store the ID in the array of all auction IDs
        auctionIds.push(id);

        // Store the address of the auction creator in the mapping
        auctionCreators[id] = msg.sender;
    }

    // Participate in an auction
    function participateInAuction(uint _id, uint _bid) public {
        // Get the auction information
		require(msg.sender != auctionCreators[_id], "Auction creator cannot participate in their own auction");
		require(!auctionParticipants[_id][msg.sender], "You have already participated in this auction");
		
        AuctionInfo storage auction = auctions[_id];
	
        // Check if the auction has ended

	    require(block.timestamp < auction.auctionEndTime, "Auction has ended");
        // Check if the bidder is the auction creator
        // Check if the bid is greater than the starting price
        require(_bid > auction.start_price, "Bid must be greater than starting price");

        // Update the highest bidder and highest bid if necessary
        if (_bid > auction.highestBid) {
            auction.highestBidder = msg.sender;
            auction.highestBid = _bid;
        }
		auction.participants.push(msg.sender);
    	auction.bids.push(_bid);
    }
    // Reveal the auction after it has ended
	function now() public view returns(uint) {
		return block.timestamp;
	}
    function getAllAuctions() public view returns (AuctionInfo[] memory) {
        AuctionInfo[] memory auctionsList = new AuctionInfo[](auctionIds.length);
        for (uint i = 0; i < auctionIds.length; i++) {
            auctionsList[i] = auctions[auctionIds[i]];
    }
  return auctionsList;
}
    function revealAuction(uint _id) public view returns (address, uint) {
        AuctionInfo storage auction = auctions[_id];
        require(block.timestamp > auction.auctionEndTime, "Auction has not yet ended.");
        return (auction.highestBidder, auction.highestBid);
    }
	function displayBids(uint _id) public view returns (address[] memory, uint[] memory) {
    // Check if the auction ID exists in the auctions mapping
     	AuctionInfo storage auction = auctions[_id];
        require(block.timestamp > auction.auctionEndTime, "Auction has not yet ended.");
            return (auction.participants, auction.bids);
    }
function displayAccountBids(uint _id, address _account) public view returns (uint) {
    // Check if the auction ID exists in the auctions mapping
    require(_id < auctionCounter, "Invalid auction ID");

    // Get the auction information
    AuctionInfo storage auction = auctions[_id];

    // Check if the auction has ended
    require(block.timestamp > auction.auctionEndTime, "Auction has not yet ended.");

    // Initialize a variable to store the total amount of bids placed by the specified Ethereum account
    uint totalBids = 0;

    // Iterate through the array of participants
        for (uint i = 0; i < auction.participants.length; i++) {
        // Check if the participant's address matches the specified Ethereum account
            if (auction.participants[i] == _account) {
            // Increment the total amount of bids
                totalBids += auction.bids[i];
            }
        }
    // Return the total amount of bids placed by the Ethereum account
    return totalBids;
    }
}