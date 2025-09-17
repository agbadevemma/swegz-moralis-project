# Moralis Integration Demo

This repository demonstrates how to integrate **Moralis Streams API** with an Express + MongoDB backend to track **incoming blockchain transactions** in real time.
It replaces costly address management services like Tatum by using **Moralis webhooks** and **Ethers.js** for wallet management.

---

## Features

* 🚀 Generate new Ethereum wallets with **Ethers.js**
* 🔔 Receive webhook events from **Moralis Streams**
* 💾 Save confirmed transactions to **MongoDB**
* 💰 Cost-efficient alternative to Tatum (no per-address credit charges)

---

## Requirements

Before running this demo, make sure you have:

* **Node.js** (v18+)
* **MongoDB** (local or Atlas)
* **Moralis API Key** ([Get one here](https://admin.moralis.io/))
* **Ethereum Sepolia Testnet RPC URL** ([Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/))

---

## Installation

Clone the repository:

```bash
git clone (https://github.com/agbadevemma/swegz-moralis-project)
cd moralis-integration-demo
npm install
```

Create a `.env` file in the root folder:

```env
PORT=9000
MORALIS_API_KEY=your_moralis_api_key
RPC_URL=https://sepolia.infura.io/v3/your_project_id
MONGO_URI=mongodb://localhost:27017/moralis_demo
```

---

## Running the Project

Start the development server:

```bash
npm run dev
```

Server will run on [http://localhost:9000](http://localhost:9000).

---

## API Routes

### Health Check

```http
GET /
```

Returns a simple JSON response to verify the server is running.

### Generate Wallet

```http
GET /wallet/new
```

Generates a new Ethereum testnet wallet.

### Fetch Balance

```http
GET /balance/:address
```

Returns the native ETH balance for the given address using Moralis API.

### Send Transaction

```http
POST /send
Content-Type: application/json
{
  "fromWallet": "0xSenderAddress",
  "to": "0xRecipientAddress",
  "amount": "0.05"
}
```

Sends ETH from your server wallet.

### Webhook (Moralis)

```http
POST /webhook
```

This is the route Moralis Streams will POST events to. It saves transaction details into MongoDB automatically.

---

## MongoDB Schema

```js
{
  hash: String,
  from: String,
  to: String,
  value: String,
  confirmed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Cost Advantage

* **Tatum**: Charges 20 credits per deposit address, even without activity.
* **Moralis**: Charges **only for API calls & streams used**. Wallet creation via Ethers.js is **free**.

This saves **thousands of credits monthly**, especially if your application scales to many deposit addresses.

---

## Resources

* [Moralis Docs](https://docs.moralis.io/)
* [Ethers.js Docs](https://docs.ethers.org/)
* [MongoDB Docs](https://www.mongodb.com/docs/)

---

## License

MIT License. Free to use and modify.

---

Do you want me to also add a **section comparing the exact monthly savings** (with an example calculation for, say, 1,000 deposit addresses) inside this README so the client immediately sees the financial benefit?
