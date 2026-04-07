# LGC Demo Dashboard Build Spec

## Goal

Build a **frontend demo dashboard** for the deployed **LGC (Logic & Growth Coin)** token on **Sepolia**.

This is **not** a generic ERC-20 dashboard. It is a **permissioned tokenized MMF demo** with:

- owner / admin roles
- whitelist-based eligibility
- restricted transfer
- admin-controlled mint / burn
- frontend-visible blocked transfer attempts

The site should be good enough for a **course demo**, not a production system.

---

## Hard Constraints

- **Do not deploy a new contract**
- Must connect to the **already deployed contract**
- Network: **Sepolia**
- Contract address: `0x320e2800731653835d9499080e38078F2E85EC1B`
- Wallet connection: **MetaMask**
- Use the existing contract only

---

## Recommended Stack

Use:

- **React**
- **Vite**
- **TypeScript**
- **ethers v6**
- **Tailwind CSS**

No backend is required.

If blocked transaction logs need persistence, store them in `localStorage`.

---

## Product Context

The frontend is for a **tokenized MMF prototype**. The token is not freely tradable like a normal ERC-20.

Core business logic:

- only approved wallets can participate in the transfer flow
- admin can mint / burn
- admin can manage whitelist
- transfer to a non-whitelisted address should fail
- failed transfer attempts should be shown in the frontend as **blocked transactions**

This should feel like a **controlled investment dashboard**, not a speculative token page.

---

## Roles

The UI must reflect role differences.

### 1. Owner
Highest permission.

Can do everything admin can do.

If supported by the contract, owner may also:
- add admin
- remove admin

### 2. Admin
Can:
- add to whitelist
- remove from whitelist
- mint
- burn

### 3. Whitelisted User
Can:
- transfer
- approve
- transferFrom

Only if the relevant addresses satisfy whitelist rules.

### 4. Non-whitelisted User
Can connect wallet and view data, but cannot successfully participate in restricted token transfer flow.

---

## Required Inputs Before Implementation

Before coding, collect the following from the team:

### Must Have
1. **Contract ABI JSON**
2. **Confirmed contract address**
3. **Confirmed network = Sepolia**
4. **One owner/admin wallet for testing**
5. **One whitelisted user wallet for testing**
6. **One non-whitelisted wallet for failure testing**

### Confirm Exact Function Names
Do not assume names. Confirm from ABI:

Read functions:
- `name()`
- `symbol()`
- `decimals()`
- `totalSupply()`
- `owner()`
- `balanceOf(address)`
- `allowance(address,address)`
- `isAdmin(address)` or equivalent
- `whitelist(address)` or `isWhitelisted(address)` or equivalent

Write functions:
- `addToWhitelist(address)`
- `removeFromWhitelist(address)`
- `mint(address,uint256)`
- `burn(address,uint256)`
- `transfer(address,uint256)`
- `approve(address,uint256)`
- `transferFrom(address,address,uint256)`

Optional owner-only functions:
- `addAdmin(address)`
- `removeAdmin(address)`
- `transferOwnership(address)`

If any names differ, the frontend must follow the ABI.

---

## UI Scope

## Page Layout

Build a **single-page dashboard** with these sections:

### A. Top Bar
Display:
- App title: `LGC Tokenized MMF Demo`
- connected wallet address
- network badge
- contract address
- current role badge:
  - Owner
  - Admin
  - Whitelisted User
  - Non-whitelisted User

### B. Token Overview
Cards showing:
- token name
- symbol
- decimals
- total supply

### C. My Wallet Status
Show:
- connected address
- my balance
- am I admin?
- am I whitelisted?
- owner address

### D. Admin Panel
Visible only for owner/admin.

Functions:
- Add to Whitelist
- Remove from Whitelist
- Mint
- Burn

Optional owner-only section:
- Add Admin
- Remove Admin
- Transfer Ownership

### E. User Panel
Visible for all connected wallets, but actions may fail depending on role and whitelist status.

Functions:
- Transfer
- Approve
- TransferFrom (can be secondary priority if time is limited)

### F. Monitoring Panel
Display:
- recent successful transactions
- blocked transactions
- known whitelisted wallets
- distribution across wallets

---

## MVP Priority

## P0 - Must Have
Implement these first:

1. Connect MetaMask
2. Show token overview
3. Show wallet status and role
4. Add/remove whitelist
5. Mint
6. Burn
7. Transfer
8. Blocked transaction display

## P1 - Good to Have
9. Approve
10. TransferFrom
11. Admin management
12. Better transaction history
13. Wallet distribution table

## P2 - Nice to Have
14. Better styling
15. Search / filter
16. Export blocked transaction logs
17. Toast notifications with detailed decode

---

## Functional Requirements

## 1. Wallet Connection
- connect using MetaMask
- detect chain
- if not on Sepolia, show a clear warning
- provide a “Switch to Sepolia” button if possible

## 2. Read Contract State
On page load and after every successful write, refresh:
- name
- symbol
- decimals
- totalSupply
- owner
- current wallet balance
- current wallet admin status
- current wallet whitelist status

## 3. Role Detection
Determine role using:
- compare current address with `owner()`
- check `isAdmin(currentAddress)` if available
- check whitelist status

Suggested role precedence:
1. Owner
2. Admin
3. Whitelisted User
4. Non-whitelisted User

## 4. Admin Actions
For each admin action:
- form input
- submit button
- pending state
- success message
- error message
- auto refresh after success

Admin actions:
- addToWhitelist(address)
- removeFromWhitelist(address)
- mint(to, amount)
- burn(from, amount)

Use token amount conversion with `decimals`.

## 5. User Actions
User actions:
- transfer(to, amount)
- approve(spender, amount)
- transferFrom(from, to, amount)

Important:
- amount input should be human-readable
- convert with `parseUnits(amount, decimals)`

## 6. Blocked Transactions
This is important for the demo.

When a user attempts a write action that fails because of whitelist or permission restrictions:

- catch the error in frontend
- record a blocked transaction object in local state and `localStorage`
- show:
  - timestamp
  - action type
  - from
  - to
  - amount
  - short error reason

Example blocked log item:
```ts
{
  time: "2026-03-20T12:34:56Z",
  action: "transfer",
  from: "0x...",
  to: "0x...",
  amount: "10",
  reason: "Recipient not whitelisted"
}
```

Important:
- blocked transactions do **not** need to be on-chain events
- frontend capture is acceptable for the demo

## 7. Wallet Distribution
At minimum, support a manually maintained list of known addresses:
- owner/admin wallets
- test user wallets
- whitelisted wallets entered during demo

For each known address, show:
- address
- balance
- role
- whitelist status

This is enough for a course demo.
Do **not** build an on-chain indexer.

---

## Suggested File Structure

```bash
src/
  abi/
    lgc.json
  components/
    TopBar.tsx
    TokenOverview.tsx
    WalletStatus.tsx
    AdminPanel.tsx
    UserPanel.tsx
    MonitoringPanel.tsx
    TxStatus.tsx
  hooks/
    useWallet.ts
    useLGCRead.ts
    useLGCWrite.ts
  lib/
    config.ts
    contract.ts
    format.ts
    blockedTxStore.ts
  pages/
    Dashboard.tsx
  App.tsx
  main.tsx
```

---

## Environment / Config

Use a config file like this:

```ts
export const CONTRACT_ADDRESS = "0x320e2800731653835d9499080e38078F2E85EC1B";
export const CHAIN_ID = 11155111; // Sepolia
export const CHAIN_NAME = "Sepolia";
```

---

## UX Requirements

- clean, dark dashboard style is acceptable
- use cards / sections
- all write actions must show:
  - pending
  - success
  - failure
- do not expose buttons that clearly cannot be used by current role if easy to hide
- or disable them with a short explanation
- all failed writes should produce readable UI feedback

---

## Out of Scope

Do **not** build:
- a backend
- a real matching engine
- a real market maker
- cross-chain logic
- real KYC integration
- production custody logic
- a full analytics platform

This is a **demo dashboard** only.

---

## Acceptance Criteria

The build is acceptable if it can do all of the following on Sepolia:

1. connect MetaMask
2. read token info from the deployed contract
3. detect current role
4. whitelist an address
5. mint to a whitelisted address
6. burn from a whitelisted address
7. transfer between approved wallets
8. reject transfer to a non-whitelisted wallet
9. show blocked transaction attempts in the frontend
10. show balances and total supply
11. show a simple wallet distribution view

---

## Implementation Notes for the Coding Agent

Please scaffold the app with:
- React + Vite + TypeScript
- ethers v6
- Tailwind CSS

Please generate:
- a clean single-page dashboard
- reusable components
- a contract helper layer
- role-aware UI
- frontend blocked transaction tracking via localStorage
- clear comments where ABI function names may differ

Assume ABI will be provided as `src/abi/lgc.json`.

Do not hardcode assumptions beyond the confirmed contract address and Sepolia network.
If a function name differs from the spec, adapt to the ABI.

The code should be demo-friendly, readable, and easy to modify.
