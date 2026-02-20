# AlgoBounties: Decentralized Micro-Task Bounty Board for Students

## Project Description
AlgoBounties is a decentralized micro-task marketplace designed specifically for students. It solves the problem of "trust" in small peer-to-peer transactions on campus. By leveraging Algorand smart contracts, task rewards are held in a secure, trustless escrow. Funds are only released once the task creator approves the work, ensuring students get what they paid for and workers are guaranteed their earnings.

## Problem Statement
**Original Idea:** Students need a secure, low-fee platform to outsource small academic or campus-related tasks (tutoring, errands, feedback) without relying on expensive or non-existent traditional payment platforms that often have high minimums or fees.

## Live Demo URL
[Live App URL](https://repl.it/@user/algobounties) (Replace with your actual Replit deployment URL)

## LinkedIn Demo Video URL
[LinkedIn Video](https://www.linkedin.com/posts/...) (To be provided by user)

## App ID (Testnet)
**App ID:** `12345678` (Placeholder - Replace with your deployed Testnet App ID)
**Explorer Link:** [Algorand Testnet Explorer](https://testnet.explorer.perawallet.app/application/12345678/)

## Architecture Overview
The system uses a hybrid architecture:
- **Frontend:** React application communicating via REST API and Algorand SDK.
- **Backend (Off-chain):** Express server with PostgreSQL for task metadata, proof storage, and user profile management.
- **Smart Contract (On-chain):** TEAL/PyTEAL based escrow contract managing the task lifecycle (Fund -> Claim -> Submit -> Release).
- **Integration:** Uses AlgoKit for smart contract development and deployment workflows.

## Tech Stack
- **Blockchain:** Algorand Testnet
- **Smart Contracts:** AlgoKit (TEALScript/PyTEAL)
- **Frontend:** React, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, Drizzle ORM
- **Database:** PostgreSQL

## Installation & Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd algobounties
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   Create a `.env` file with `DATABASE_URL` and `SESSION_SECRET`.
4. **Deploy Smart Contract:**
   ```bash
   algokit bootstrap
   algokit deploy
   ```
5. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage Guide
1. **Login:** Use Replit Auth to sign in.
2. **Link Wallet:** Go to your profile and enter your Algorand Testnet address.
3. **Create Bounty:** Fill out the task details and reward amount. This triggers the smart contract deployment.
4. **Claim Task:** Browse the dashboard and claim a task that fits your skills.
5. **Submit Proof:** Once finished, upload your proof (URL or text).
6. **Approve:** The creator reviews the proof and clicks "Approve" to release the ALGOs.

## Known Limitations
- Currently uses a mocked signature flow for demonstration purposes; requires integration with Pera Wallet or Defly for production Testnet signing.
- File uploads are currently stored as URLs; future versions will integrate IPFS.

## Team Members and Roles
- **[Name]:** Full Stack Developer & Smart Contract Architect
