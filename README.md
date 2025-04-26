# ChainWork Frontend

ChainWork is a decentralized freelancing platform built on the Electroneum blockchain. This frontend provides an intuitive and seamless experience for task providers and freelancers to interact with the platform, using React.js and Vite.

This is a frontend demo focusing on the blockchain payment integration system I developed.

---

## Key Features

- **Task Posting Interface**: Task providers can create and post tasks with all necessary details like description, deadline, and bounty amount.
- **Submission Management**: Freelancers can view tasks, submit proposals, and track their submissions through a structured interface.
- **Wallet Integration**: A built-in ETN wallet connection ensures seamless payment transactions.
- **Responsive Design**: Optimized for a wide range of devices, including desktops, tablets, and mobile phones.

---

## My Contribution: Blockchain Payment Integration

I implemented the payment integration system for ChainWork, enabling secure transactions on the Electroneum blockchain.

### Features Implemented

#### MetaMask Wallet Integration

- Built a seamless wallet connection system that detects and connects to MetaMask
- Implemented network detection and automatic switching to the Electroneum blockchain

#### Multi-Currency Payment System

- Developed a fiat-to-cryptocurrency conversion feature allowing users to create tasks in USD/EUR/GBP
- Integrated with CoinGeckoAPI to fetch real-time exchange rates
- Added confirmation flows to ensure users understand cryptocurrency amounts

#### Blockchain Transaction Handling

- Created a modular service architecture for blockchain interactions
- Implemented task creation with secure escrow payments

#### Smart Contract Integration

- Integrated frontend with Electroneum smart contracts
- Developed task data synchronization between blockchain and backend database

### Technical Implementation

My implementation evolved through several iterations:

- Initially designed using a context-based architecture for centralized state management
- Later refactored to a more modular service-based approach for better maintainability
- Enhanced with fiat currency conversion to make the platform more accessible to users unfamiliar with cryptocurrency

The final payment integration uses a modular service-based architecture:

- `contract.ts` - Handles basic blockchain setup and utility functions
- `contractService.ts` - Provides specific blockchain transaction methods
- `WalletConnect.tsx` - UI component for wallet connection
- `api.ts` - Backend API communication

---

## Getting Started

### **Prerequisites**

- Node.js installed on your system.
- Vite.js (comes preconfigured with this project).
- A compatible ETN wallet.

### **Installation**

1. Clone the repository and navigate to the frontend folder:
   ```bash
   git clone https://github.com/Gallie83/Chainwork-Payment.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### **Run the Application**

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Folder Structure

```
Chainwork_Frontend/
|-- public/        # Static assets
|-- src/
    |-- components/  # Reusable React components
    |-- pages/       # Main application pages
    |-- hooks/       # Custom React hooks
    |-- utils/       # Utility functions
    |-- styles/      # Global and component-specific styles
|-- vite.config.js  # Vite configuration file
|-- package.json    # Project dependencies and scripts
```

---

## Technologies Used

- **Frontend Framework**: React.js (with Vite for fast development, and TypeScript).
- **Styling**: CSS Modules and Tailwind CSS.
- **Blockchain Integration**: Ethers.js for Electroneum blockchain interactions
- **API Integration**: Axios for seamless communication with the backend.
- **Wallet Integration**: MetaMask for secure transactions

---

## Demo Scope

This repository focuses on the frontend blockchain interactions, wallet connection, and cryptocurrency payment process. The implementation demonstrates the complete task creation flow, from wallet connection to blockchain transaction.

_Note: This demo includes mock data and simulated responses for portfolio demonstration purposes. In a production environment, it would connect to actual Electroneum blockchain smart contracts._

---

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## Contact

For queries, feedback, or contributions, feel free to reach out at [gallie2913@gmail.com].
