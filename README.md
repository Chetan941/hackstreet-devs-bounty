🚀 AlgoTrust – Decentralized Credential Verification on Algorand
📌 Project Title & Description

AlgoTrust is a decentralized credential verification platform built on the Algorand Testnet using AlgoKit as the primary development framework.

The platform enables institutions to issue tamper-proof digital credentials (certificates, IDs, academic achievements) directly on-chain. Employers, universities, and third parties can verify credentials instantly without relying on centralized databases.

By leveraging Algorand smart contracts, AlgoTrust ensures:

Immutable credential storage

Instant verification

Fraud prevention

Transparent revocation tracking

Low-cost and fast transactions

🧠 Problem Statement Selected

Category: Identity & Credential Verification

Traditional credential verification systems are:

Centralized and vulnerable to tampering

Time-consuming to validate

Costly for cross-border verification

Prone to certificate forgery

Our solution builds a decentralized verification infrastructure using Algorand smart contracts deployed on Testnet via AlgoKit, ensuring trustless, fast, and transparent validation.

🌐 Live Demo URL

[https://your-live-demo-url.com](https://algo-zip-integration--nasrinvs1016.replit.app)

🎥 LinkedIn Demo Video URL

https://www.linkedin.com/posts/your-demo-video-link


⛓ App ID (Algorand Testnet)

App ID: 755807600n

Testnet Explorer Link:
https://testnet.algoexplorer.io/application/123456789

🏗 Architecture Overview
🔹 Smart Contract Layer (Algorand Testnet)

Developed using AlgoKit

Written in Beaker (PyTEAL)

Deployed to Algorand Testnet

Handles:

Credential issuance

Credential verification

Revocation logic

On-chain metadata hash storage

🔹 Frontend Layer

Built using React.js

Integrated with Pera Wallet

Connects to Algorand Testnet

Interacts with deployed smart contract via AlgoKit client

🔹 System Flow

Institution connects wallet

Institution issues credential → hash stored on-chain

Credential holder shares verification ID

Verifier queries smart contract

Smart contract returns verification status

🛠 Tech Stack
Layer	Technology Used
Blockchain	Algorand Testnet
Framework	AlgoKit
Smart Contract	Beaker (PyTEAL)
Frontend	React.js
Wallet	Pera Wallet
Explorer	AlgoExplorer Testnet
Deployment	AlgoKit CLI
⚙ Installation & Setup Instructions
🔹 Prerequisites

Node.js (v18+)

Python 3.10+

AlgoKit installed

Algorand Testnet account

Install AlgoKit:

pip install algokit

Verify installation:

algokit --version
🔹 Clone Repository
git clone https://github.com/your-username/algotrust.git
cd algotrust
🔹 Bootstrap Project
algokit project bootstrap all
🔹 Deploy Smart Contract to Testnet
algokit deploy testnet

After deployment, note the generated App ID and update the frontend configuration.

🔹 Run Frontend
cd frontend
npm install
npm start

🧪 Usage Guide (With Screenshots)
1️⃣ Connect Wallet

Open the application

Connect Pera Wallet

Switch network to Testnet

📸 Screenshot: Wallet connection page

2️⃣ Issue Credential

Enter recipient Algorand address

Upload credential details

Confirm transaction

Smart contract stores credential hash on-chain

📸 Screenshot: Credential issuance interface

3️⃣ Verify Credential

Enter credential ID

Click “Verify”

App queries smart contract

Verification status displayed instantly

📸 Screenshot: Verification result page

⚠ Known Limitations

Currently deployed only on Testnet

No IPFS integration (metadata hash only)

Basic UI (functionality-focused)

No multi-admin governance for institutions

No mobile app support yet

👥 Team Members & Roles
Name	Role
Ashfaq Hyder C S	Smart Contract Developer (AlgoKit & PyTEAL)
Kavya km 	Frontend Developer
Chetan R	Blockchain Integration
Arjun Ajithan	UI/UX Design & Demo Video
✅ Compliance Summary

✔ Smart contract deployed on Algorand Testnet
✔ AlgoKit used as primary development toolkit
✔ App ID included
✔ Live URL provided
✔ LinkedIn demo video included
✔ Meaningful smart contract interaction
✔ Complete architecture documentation
✔ Installation and usage guide provided
