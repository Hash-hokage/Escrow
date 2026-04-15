# Ethereal Ledger - Onchain Escrow

Ethereal Ledger is a secure, decentralized escrow platform built for the modern digital economy. It solves the problem of enforcing high-value agreements on the blockchain by introducing a trustless protocol that locks funds in a smart contract. The funds are immutable and exclusively managed by strict mathematical rules or the intervention of an assigned arbitrator, providing a zero-trust execution environment between a buyer and a seller.

## Architecture

The project consists of two distinct components:
1. **Smart Contracts (Backend)**: Built with Solidity and utilizing the Foundry toolchain for core development, testing, and deployment.
2. **Frontend UI**: Built with Next.js (App Router), Tailwind CSS, Wagmi (v2), and Viem (v2) for seamless and secure Web3 interactions.

---

## Smart Contract

The core of Ethereal Ledger is the `Escrow.sol` contract deployed on Ethereum-compatible networks (like Sepolia). 

### State Machine

The escrow contract strictly enforces state transitions through an internal enumeration model (`State`):
- `Awaiting` (0): Default state. Contract initialized but funds not yet supplied.
- `Funded` (1): Buyer has supplied the funds. Expected timeframe for delivery.
- `Disputed` (2): Pause triggered. Arbitration is required.
- `Complete` (3): Seller successfully received funds.
- `Reimbursed` (4): Funds returned to the buyer post-deadline.
- `Resolved` (5): Arbitrator finalized the dispute and dispersed funds.

### Key Functions

- `createEscrow(address _seller, address _arbitrator, uint256 _deadline) payable`: Initializes a new escrow structure containing the roles and locks the transaction value.
- `release(uint256 id)`: Releases the locked funds to the seller.
- `dispute(uint256 id)`: Freezes the specific escrow state, allowing the assigned arbitrator to step in.
- `refund(uint256 id)`: Reimburses the buyer only if the execution deadline is exceeded without fulfillment.
- `resolve(uint256 id, bool favouredBuyer)`: Callable exclusively by the arbitrator to forcibly settle a disputed engagement, shifting payout to either the buyer or the seller.

---

## Frontend Application

The user interface delivers a production-grade Web3 standard, implementing clear token design and comprehensive dynamic routing to match the strict protocol features.

### Tech Stack
- **Framework**: Next.js 14 (App Router), React
- **Styling**: Tailwind CSS (v3) tailored with custom glass-morphism and strict global design tokens.
- **Web3 Layer**: Wagmi Core (v2), Viem (v2), TanStack React Query.
- **Typography and Assets**: Optimized to eliminate build-time timeouts during cloud CI/CD deployments.

### User Roles & Workflows
- **Buyer Dashboard**: Dedicated panel for deploying new escrows into the `Escrow.sol` registry natively. Allows the buyer to monitor their locked investments and action "Release", "Dispute", or "Refund" functions on contracts.
- **Seller Dashboard**: Provides an integrated view of all engagements where the connected wallet is designated as the seller. Includes options to trigger a dispute if an issue arises.
- **Arbitrator Dashboard**: Functions as a priority jurisdiction panel. The interface intrinsically sifts through all on-chain events and isolates contracts exclusively marked as `Disputed` and assigned to the user. Features "Favour Buyer" and "Favour Seller" tools to orchestrate immutable resolutions.
- **Global Overview**: Unified landing map rendering transparent indexing across the deployed protocol via `EscrowSearchBar`.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Foundry (Forge, Cast, Anvil)
- A Web3 Wallet (e.g., MetaMask, Rabby)

### Smart Contract Setup

1. Make sure Foundry is installed.
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
2. Build and run tests.
   ```bash
   cd onchain-escrow
   forge build
   forge test
   ```
3. Deploy to a testnet (e.g., Sepolia) or local Anvil node using your RPC URL and private key via standard `forge script` methods. Note the deployed contract address.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your variables. Create a `.env.local` file at the root of `frontend/`:
   ```env
   NEXT_PUBLIC_RPC_URL=https://your-sepolia-rpc-url
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:3000`.

---

## Security Notice
This escrow architecture involves handling real value securely on-chain. While comprehensive logic paths exist for refunds and dispute resolutions, the specific environment requires correct interaction from verified Arbitrators during disputes. Ensure all metadata parameters are accurately verified prior to initializing value-locked contracts.
