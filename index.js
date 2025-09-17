require("dotenv").config();
const express = require("express");
const Moralis = require("moralis").default;
const { ethers } = require("ethers");
const mongoose = require("mongoose");
const { Wallet, Transaction } = require("./model");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ---------- INIT MONGODB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ---------- INIT MORALIS ----------
(async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
  console.log("✅ Moralis initialized");
})();

// ---------- INIT ETHERS ----------
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ---------- ROUTES ----------

// Generate Wallet Address & Save
app.get("/wallet/new", async (req, res) => {
  try {
    const newWallet = ethers.Wallet.createRandom();

    const walletDoc = new Wallet({
      address: newWallet.address,
      privateKey: newWallet.privateKey, // ⚠️ store encrypted in production
      mnemonic: newWallet.mnemonic?.phrase,
    });

    await walletDoc.save();

    res.json({
      address: walletDoc.address,
      privateKey: walletDoc.privateKey,
      mnemonic: walletDoc.mnemonic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health route
app.get("/", (req, res) => {
  res.json({ message: "Hello from Moralis + Ethers API 🚀" });
});

// Fetch token balance (via Moralis)
app.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "0xaa36a7", // Ethereum Sepolia testnet
      address,
    });
    res.json(response.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send transaction (via Ethers)
app.post("/send", async (req, res) => {
  try {
    const { to, amount } = req.body;

    const tx = {
      to,
      value: ethers.parseEther(amount.toString()),
    };

    const txResponse = await wallet.sendTransaction(tx);
    await txResponse.wait();

    // Save TX in DB
    const txDoc = new Transaction({
      hash: txResponse.hash,
      from: wallet.address,
      to,
      value: amount.toString(),
      confirmed: true,
    });
    await txDoc.save();

    res.json({ hash: txResponse.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- WEBHOOK ROUTE ----------
app.post("/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    console.log("🔔 Webhook received:", JSON.stringify(webhookData, null, 2));

    if (webhookData.confirmed && webhookData.txs) {
      for (const tx of webhookData.txs) {
        console.log(`✅ Transaction detected! Hash: ${tx.hash}`);

        // Save TX in DB
        await Transaction.findOneAndUpdate(
          { hash: tx.hash },
          {
            from: tx.fromAddress,
            to: tx.toAddress,
            value: ethers.formatEther(tx.value),
            confirmed: tx.confirmed,
          },
          { upsert: true, new: true }
        );
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
