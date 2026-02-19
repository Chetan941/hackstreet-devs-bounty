# hackstreet-devs-bounty
Problem statement: 
Students often need help with small tasks but lack a trusted platform where payment is guaranteed after completion. Our solution provides a decentralized micro‑task marketplace with escrow‑based crypto payments ensuring trust between participants.
Solution Summary:
A Web3 micro‑task bounty board where students post tasks with ALGO rewards locked in smart contract escrow. Workers claim tasks, submit proof, and receive automated payment upon approval.
System Architecture:
Frontend (React) → Firebase (task metadata) → Algorand Smart Contract (escrow + task state)
Wallet → identity + transaction signing

On‑chain Data(Algorand): reward amount, creator wallet, worker wallet, task status,payment release logic

Off‑chain Data(Firebase): description, proof files, UI metadata, timestamps

Smart Contract Methods:
(1)create_task
(2)claim_task
(3)submit_task
(4)approve_task
