# ChainWork Frontend

ChainWork Frontend is the user interface component of the ChainWork platform, built using Vite and React.js. It provides an intuitive and seamless experience for task providers and freelancers to interact with the platform.

---

## Key Features

- **Task Posting Interface**: Task providers can create and post tasks with all necessary details like description, deadline, and bounty amount.
- **Submission Management**: Freelancers can view tasks, submit proposals, and track their submissions through a structured interface.
- **AI Assistance Integration**: AI-powered tools are accessible through the frontend to help freelancers improve their task quality and efficiency.
- **Wallet Integration**: A built-in ETN wallet connection ensures seamless payment transactions.
- **Responsive Design**: Optimized for a wide range of devices, including desktops, tablets, and mobile phones.

---

## Getting Started

### **Prerequisites**
- Node.js installed on your system.
- Vite.js (comes preconfigured with this project).
- A compatible ETN wallet.

### **Installation**
1. Clone the repository and navigate to the frontend folder:
   ```bash
   git clone https://github.com/yourusername/chainwork.git
   cd chainwork/Chainwork_Frontend
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
- **Frontend Framework**: React.js (with Vite for fast development).
- **Styling**: CSS Modules and Tailwind CSS.
- **State Management**: Context API.
- **API Integration**: Axios for seamless communication with the backend.
- **Wallet Integration**: ETN wallet for payment transactions.

---

## Contribution Guidelines
1. Fork the repository.
2. Navigate to the frontend folder and create a new branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch-name
   ```
5. Open a Pull Request.

---

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## Contact
For queries, feedback, or contributions, feel free to reach out at [contact@chainwork.com].

