//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Escrow {
    enum State {
        Awaiting, // Default state, awaiting payment
        Funded, // Payment made, awaiting delivery
        Disputed, // Paused for arbitration, awaiting resolution
        Complete, // Transaction complete
        Reimbursed, // Buyer Refunded via dispute or deadline
        Resolved // Dispute resolved, Seller paid via arbitration
    }

    struct Transaction {
        uint256 id;
        address buyer;
        address seller;
        address arbitrator;
        uint256 amount;
        uint256 deadline;
        State currentState;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 public escrowCount;
    mapping(uint256 => Transaction) public escrows;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event EscrowCreated(
        uint256 indexed id, address indexed buyer, address indexed seller, uint256 amount, uint256 deadline
    );
    event Deposited(uint256 indexed id, address indexed buyer, uint256 amount);
    event Released(uint256 indexed id, address indexed seller, uint256 amount);
    event Refunded(uint256 indexed id, address indexed buyer, uint256 amount);
    event DisputeRaised(uint256 indexed id, address indexed raisedBy);
    event DisputeResolved(uint256 indexed id, address indexed arbitrator, bool favouredBuyer);

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyBuyer(uint256 id) {
        require(msg.sender == escrows[id].buyer, "not the buyer");
        _;
    }

    modifier onlyBuyerOrSeller(uint256 id) {
        require(msg.sender == escrows[id].buyer || msg.sender == escrows[id].seller, "not buyer or seller");
        _;
    }

    modifier onlyArbitrator(uint256 id) {
        require(msg.sender == escrows[id].arbitrator, "not the arbitrator");
        _;
    }

    modifier inState(uint256 id, State expectedState) {
        require(escrows[id].currentState == expectedState, "invalid state");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function createEscrow(address _seller, address _buyer, uint256 _deadline) external payable {
        require(msg.value > 0, "amount must be greater than 0");
        require(_seller != address(0) && _buyer != address(0), "invalid address");
        require(_seller != _buyer, "seller and buyer cannot be the same");

        uint256 id = escrowCount++;
        escrows[id] = Transaction({
            id: id,
            buyer: _buyer,
            seller: _seller,
            arbitrator: address(0),
            amount: msg.value,
            deadline: block.timestamp + _deadline,
            currentState: State.Awaiting
        });

        emit EscrowCreated(id, _buyer, _seller, msg.value, escrows[id].deadline);
    }

    function release(uint256 id) external onlyBuyer(id) inState(id, State.Funded) {
        escrows[id].currentState = State.Complete;

        (bool success,) = escrows[id].seller.call{value: escrows[id].amount}("");
        require(success, "transfer failed");

        emit Released(id, escrows[id].seller, escrows[id].amount);
    }

    function dispute(uint256 id) external onlyBuyerOrSeller(id) inState(id, State.Funded) {
        escrows[id].currentState = State.Disputed;

        emit DisputeRaised(id, msg.sender);
    }

    function refund(uint256 id) external onlyBuyer(id) inState(id, State.Funded) {
        require(block.timestamp > escrows[id].deadline, "deadline has not passed");

        escrows[id].currentState = State.Reimbursed;

        (bool success,) = escrows[id].buyer.call{value: escrows[id].amount}("");
        require(success, "refund failed");

        emit Refunded(id, escrows[id].buyer, escrows[id].amount);
    }

    function resolve(uint256 id, bool favouredBuyer) external onlyArbitrator(id) inState(id, State.Disputed) {
        if (favouredBuyer) {
            escrows[id].currentState = State.Reimbursed;
            (bool success,) = escrows[id].buyer.call{value: escrows[id].amount}("");
            require(success, "Reinbursment failed");
        } else {
            escrows[id].currentState = State.Resolved;
            (bool success,) = escrows[id].seller.call{value: escrows[id].amount}("");
            require(success, "Resolution failed");
        }

        emit DisputeResolved(id, escrows[id].arbitrator, favouredBuyer);
    }
}
