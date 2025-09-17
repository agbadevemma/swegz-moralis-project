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

## 🔔 Example Webhook Payload (Moralis Streams)

When a transaction involving one of your monitored addresses occurs, Moralis will `POST` a payload to your `/webhook` endpoint.
Below is a **sample payload** received from the Ethereum Sepolia testnet (`0xaa36a7`):

```json
{
  "confirmed": false,
  "chainId": "0xaa36a7",
  "abi": [],
  "streamId": "f3fb3070-d434-418f-ba72-8a00499449de",
  "tag": "swegz",
  "retries": 0,
  "block": {
    "number": "9224061",
    "hash": "0xb7cd75bb54d12fba5594a146ef58d577409bb75d7e1d43217458c1ed5fb5ecae",
    "timestamp": "1758139848"
  },
  "logs": [],
  "txs": [
    {
      "hash": "0xf3054c8594a4f7e7bd28ebddc5e62702210c8eff85788e1d8951f96c473c13d1",
      "gas": "21000",
      "gasPrice": "10021141",
      "nonce": "1",
      "input": "0x",
      "transactionIndex": "87",
      "fromAddress": "0x732147956ce03fb7a12f4512c07e737987b1eec0",
      "toAddress": "0x616a47cad2364e4e89c5fbe16d45920ad2827ee4",
      "value": "1000000000000",
      "type": "2",
      "v": "0",
      "r": "74358471754667782923191277907367731927792487906327280857926827866306115179274",
      "s": "51064069772603168407478459447506174992713400639282124128723190272072178017385",
      "receiptCumulativeGasUsed": "18374502",
      "receiptGasUsed": "21000",
      "receiptContractAddress": null,
      "receiptRoot": null,
      "receiptStatus": "1",
      "triggered_by": [
        "0x732147956ce03fb7a12f4512c07e737987b1eec0",
        "0x616a47cad2364e4e89c5fbe16d45920ad2827ee4"
      ]
    }
  ],
  "txsInternal": [],
  "erc20Transfers": [],
  "erc20Approvals": [],
  "nftTokenApprovals": [],
  "nftApprovals": {
    "ERC721": [],
    "ERC1155": []
  },
  "nftTransfers": [],
  "nativeBalances": []
}
```

### ⚡ How It’s Used

* `confirmed`: `false` initially (pending), updated to `true` when block confirmations are complete.
* `txs`: Contains transaction(s) involving your subscribed address.
* `fromAddress` / `toAddress`: Useful for recording sender and receiver.
* `value`: Transaction value in **wei** (convert using `ethers.formatEther`).

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
