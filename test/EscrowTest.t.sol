//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Escrow} from "../src/Escrow.sol";

/// @dev A contract that rejects incoming ETH — used to force transfer failures
contract RejectEther {
    receive() external payable {
        revert("I reject your ETH");
    }

    function callRelease(Escrow escrow, uint256 id) external {
        escrow.release(id);
    }

    function callRefund(Escrow escrow, uint256 id) external {
        escrow.refund(id);
    }

    function callResolve(Escrow escrow, uint256 id, bool favouredBuyer) external {
        escrow.resolve(id, favouredBuyer);
    }
}

contract EscrowTest is Test {
    Escrow public escrow;

    address public buyer = makeAddr("buyer");
    address public seller = makeAddr("seller");
    address public arbitrator = makeAddr("arbitrator");
    address public randomUser = makeAddr("randomUser");

    uint256 public constant AMOUNT = 1 ether;
    uint256 public constant DEADLINE = 7 days;

    /*//////////////////////////////////////////////////////////////
                                 SETUP
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        escrow = new Escrow();
        vm.deal(buyer, 10 ether);
        vm.deal(seller, 10 ether);
        vm.deal(arbitrator, 10 ether);
        vm.deal(randomUser, 10 ether);
    }

    /*//////////////////////////////////////////////////////////////
                              HELPERS
    //////////////////////////////////////////////////////////////*/

    /// @dev Creates an escrow and forces its state to Funded
    /// The contract sets state to Awaiting on creation, but release/dispute/refund
    /// require Funded. We use vm.store to set the state to Funded (enum index 1).
    function _createAndFundEscrow() internal returns (uint256 id) {
        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);
        id = escrow.escrowCount() - 1;
        _setEscrowState(id, Escrow.State.Funded);
    }

    /// @dev Sets the state of an escrow using vm.store
    /// Storage layout: escrows mapping is at slot 1
    /// For mapping(uint256 => Transaction), the slot for escrows[id] is keccak256(abi.encode(id, 1))
    /// Transaction struct fields: id(0), buyer(1), seller(2), arbitrator(3), amount(4), deadline(5), currentState(6)
    /// So currentState is at base_slot + 6
    function _setEscrowState(uint256 id, Escrow.State state) internal {
        bytes32 baseSlot = keccak256(abi.encode(id, uint256(1)));
        bytes32 stateSlot = bytes32(uint256(baseSlot) + 6);
        vm.store(address(escrow), stateSlot, bytes32(uint256(state)));
    }

    /// @dev Creates an escrow in Disputed state (for resolve tests)
    function _createDisputedEscrow() internal returns (uint256 id) {
        id = _createAndFundEscrow();
        _setEscrowState(id, Escrow.State.Disputed);
    }

    /*//////////////////////////////////////////////////////////////
                           createEscrow TESTS
    //////////////////////////////////////////////////////////////*/

    // ==================== HAPPY PATH ====================

    function test_CreateEscrow_Success() public {
        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);

        uint256 id = escrow.escrowCount() - 1;
        (
            uint256 txId,
            address txBuyer,
            address txSeller,
            address txArbitrator,
            uint256 txAmount,
            uint256 txDeadline,
            Escrow.State txState
        ) = escrow.escrows(id);

        assertEq(txId, 0);
        assertEq(txBuyer, buyer);
        assertEq(txSeller, seller);
        assertEq(txArbitrator, arbitrator);
        assertEq(txAmount, AMOUNT);
        assertEq(txDeadline, block.timestamp + DEADLINE);
        assertEq(uint256(txState), uint256(Escrow.State.Awaiting));
    }

    // ==================== SAD PATHS ====================

    function test_CreateEscrow_RevertIf_ZeroValue() public {
        vm.prank(buyer);
        vm.expectRevert("amount must be greater than 0");
        escrow.createEscrow{value: 0}(seller, arbitrator, DEADLINE);
    }

    function test_CreateEscrow_RevertIf_SellerIsZeroAddress() public {
        vm.prank(buyer);
        vm.expectRevert("invalid address");
        escrow.createEscrow{value: AMOUNT}(address(0), arbitrator, DEADLINE);
    }

    function test_CreateEscrow_RevertIf_SellerIsBuyer() public {
        vm.prank(buyer);
        vm.expectRevert("seller and buyer cannot be the same");
        escrow.createEscrow{value: AMOUNT}(buyer, arbitrator, DEADLINE);
    }

    function test_CreateEscrow_RevertIf_DeadlineIsZero() public {
        vm.prank(buyer);
        vm.expectRevert("deadline must be greater than 0");
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, 0);
    }

    function test_CreateEscrow_RevertIf_ArbitratorIsZeroAddress() public {
        vm.prank(buyer);
        vm.expectRevert("arbitrator cannot be the zero address");
        escrow.createEscrow{value: AMOUNT}(seller, address(0), DEADLINE);
    }

    /*//////////////////////////////////////////////////////////////
                             release TESTS
    //////////////////////////////////////////////////////////////*/

    // ==================== HAPPY PATH ====================

    function test_Release_Success() public {
        uint256 id = _createAndFundEscrow();

        uint256 sellerBalanceBefore = seller.balance;

        vm.prank(buyer);
        escrow.release(id);

        (,,,,,, Escrow.State state) = escrow.escrows(id);
        assertEq(uint256(state), uint256(Escrow.State.Complete));
        assertEq(seller.balance, sellerBalanceBefore + AMOUNT);
    }

    // ==================== SAD PATHS ====================

    function test_Release_RevertIf_CallerIsNotBuyer_RandomUser() public {
        uint256 id = _createAndFundEscrow();

        vm.prank(randomUser);
        vm.expectRevert("not the buyer");
        escrow.release(id);
    }

    function test_Release_RevertIf_CallerIsSeller() public {
        uint256 id = _createAndFundEscrow();

        vm.prank(seller);
        vm.expectRevert("not the buyer");
        escrow.release(id);
    }

    function test_Release_RevertIf_CallerIsArbitrator() public {
        uint256 id = _createAndFundEscrow();

        vm.prank(arbitrator);
        vm.expectRevert("not the buyer");
        escrow.release(id);
    }

    function test_Release_RevertIf_StateIsNotFunded() public {
        // Escrow is in Awaiting state (default after creation, not forced to Funded)
        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;

        vm.prank(buyer);
        vm.expectRevert("invalid state");
        escrow.release(id);
    }

    function test_Release_RevertIf_TransferFails() public {
        // Deploy a contract that rejects ETH as the "seller"
        RejectEther rejectSeller = new RejectEther();

        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(address(rejectSeller), arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;
        _setEscrowState(id, Escrow.State.Funded);

        vm.prank(buyer);
        vm.expectRevert("transfer failed");
        escrow.release(id);
    }

    /*//////////////////////////////////////////////////////////////
                             dispute TESTS
    //////////////////////////////////////////////////////////////*/

    // ==================== HAPPY PATHS ====================

    function test_Dispute_Success_Buyer() public {
        uint256 id = _createAndFundEscrow();

        vm.prank(buyer);
        escrow.dispute(id);

        (,,,,,, Escrow.State state) = escrow.escrows(id);
        assertEq(uint256(state), uint256(Escrow.State.Disputed));
    }

    function test_Dispute_Success_Seller() public {
        uint256 id = _createAndFundEscrow();

        vm.prank(seller);
        escrow.dispute(id);

        (,,,,,, Escrow.State state) = escrow.escrows(id);
        assertEq(uint256(state), uint256(Escrow.State.Disputed));
    }

    // ==================== SAD PATHS ====================

    function test_Dispute_RevertIf_CallerIsNotBuyerOrSeller() public {
        uint256 id = _createAndFundEscrow();

        vm.prank(randomUser);
        vm.expectRevert("not buyer or seller");
        escrow.dispute(id);
    }

    function test_Dispute_RevertIf_StateIsNotFunded() public {
        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;
        // State is Awaiting, not Funded

        vm.prank(buyer);
        vm.expectRevert("invalid state");
        escrow.dispute(id);
    }

    /*//////////////////////////////////////////////////////////////
                              refund TESTS
    //////////////////////////////////////////////////////////////*/

    // ==================== HAPPY PATH ====================

    function test_Refund_Success() public {
        uint256 id = _createAndFundEscrow();

        // Warp past the deadline
        vm.warp(block.timestamp + DEADLINE + 1);

        uint256 buyerBalanceBefore = buyer.balance;

        vm.prank(buyer);
        escrow.refund(id);

        (,,,,,, Escrow.State state) = escrow.escrows(id);
        assertEq(uint256(state), uint256(Escrow.State.Reimbursed));
        assertEq(buyer.balance, buyerBalanceBefore + AMOUNT);
    }

    // ==================== SAD PATHS ====================

    function test_Refund_RevertIf_CallerIsNotBuyer_RandomUser() public {
        uint256 id = _createAndFundEscrow();
        vm.warp(block.timestamp + DEADLINE + 1);

        vm.prank(randomUser);
        vm.expectRevert("not the buyer");
        escrow.refund(id);
    }

    function test_Refund_RevertIf_CallerIsSeller() public {
        uint256 id = _createAndFundEscrow();
        vm.warp(block.timestamp + DEADLINE + 1);

        vm.prank(seller);
        vm.expectRevert("not the buyer");
        escrow.refund(id);
    }

    function test_Refund_RevertIf_SellerCallsBeforeDeadline() public {
        uint256 id = _createAndFundEscrow();
        // Do NOT warp — deadline has not passed

        vm.prank(seller);
        vm.expectRevert("not the buyer");
        escrow.refund(id);
    }

    function test_Refund_RevertIf_StateIsNotFunded() public {
        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;
        // State is Awaiting

        vm.warp(block.timestamp + DEADLINE + 1);

        vm.prank(buyer);
        vm.expectRevert("invalid state");
        escrow.refund(id);
    }

    function test_Refund_RevertIf_DeadlineNotPassed() public {
        uint256 id = _createAndFundEscrow();
        // Do NOT warp past deadline

        vm.prank(buyer);
        vm.expectRevert("deadline has not passed");
        escrow.refund(id);
    }

    function test_Refund_RevertIf_TransferFails() public {
        // Deploy a contract that rejects ETH as the "buyer"
        RejectEther rejectBuyer = new RejectEther();
        vm.deal(address(rejectBuyer), 10 ether);

        // The RejectEther contract creates the escrow (so it is the buyer)
        vm.prank(address(rejectBuyer));
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;
        _setEscrowState(id, Escrow.State.Funded);

        vm.warp(block.timestamp + DEADLINE + 1);

        // The rejectBuyer contract calls refund — transfer back to it will fail
        vm.prank(address(rejectBuyer));
        vm.expectRevert("refund failed");
        escrow.refund(id);
    }

    /*//////////////////////////////////////////////////////////////
                             resolve TESTS
    //////////////////////////////////////////////////////////////*/

    // ==================== HAPPY PATHS ====================

    function test_Resolve_FavourBuyer_Success() public {
        uint256 id = _createDisputedEscrow();

        uint256 buyerBalanceBefore = buyer.balance;

        vm.prank(arbitrator);
        escrow.resolve(id, true);

        (,,,,,, Escrow.State state) = escrow.escrows(id);
        assertEq(uint256(state), uint256(Escrow.State.Reimbursed));
        assertEq(buyer.balance, buyerBalanceBefore + AMOUNT);
    }

    function test_Resolve_FavourSeller_Success() public {
        uint256 id = _createDisputedEscrow();

        uint256 sellerBalanceBefore = seller.balance;

        vm.prank(arbitrator);
        escrow.resolve(id, false);

        (,,,,,, Escrow.State state) = escrow.escrows(id);
        assertEq(uint256(state), uint256(Escrow.State.Resolved));
        assertEq(seller.balance, sellerBalanceBefore + AMOUNT);
    }

    // ==================== SAD PATHS ====================

    function test_Resolve_RevertIf_CallerIsNotArbitrator_Buyer() public {
        uint256 id = _createDisputedEscrow();

        vm.prank(buyer);
        vm.expectRevert("not the arbitrator");
        escrow.resolve(id, true);
    }

    function test_Resolve_RevertIf_CallerIsNotArbitrator_Seller() public {
        uint256 id = _createDisputedEscrow();

        vm.prank(seller);
        vm.expectRevert("not the arbitrator");
        escrow.resolve(id, false);
    }

    function test_Resolve_RevertIf_StateIsNotDisputed() public {
        uint256 id = _createAndFundEscrow();
        // State is Funded, not Disputed

        vm.prank(arbitrator);
        vm.expectRevert("invalid state");
        escrow.resolve(id, true);
    }

    function test_Resolve_RevertIf_ReimbursementFails() public {
        // Create escrow where buyer is a contract that rejects ETH
        RejectEther rejectBuyer = new RejectEther();
        vm.deal(address(rejectBuyer), 10 ether);

        vm.prank(address(rejectBuyer));
        escrow.createEscrow{value: AMOUNT}(seller, arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;
        _setEscrowState(id, Escrow.State.Disputed);

        vm.prank(arbitrator);
        vm.expectRevert("Reinbursment failed");
        escrow.resolve(id, true); // favour buyer — transfer to rejectBuyer fails
    }

    function test_Resolve_RevertIf_ResolutionFails() public {
        // Create escrow where seller is a contract that rejects ETH
        RejectEther rejectSeller = new RejectEther();

        vm.prank(buyer);
        escrow.createEscrow{value: AMOUNT}(address(rejectSeller), arbitrator, DEADLINE);
        uint256 id = escrow.escrowCount() - 1;
        _setEscrowState(id, Escrow.State.Disputed);

        vm.prank(arbitrator);
        vm.expectRevert("Resolution failed");
        escrow.resolve(id, false); // favour seller — transfer to rejectSeller fails
    }
}
