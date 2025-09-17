require("dotenv").config();
const express = require("express");
const Moralis = require("moralis").default;
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

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

// ---------- NEW: Generate Wallet Address ----------
app.get("/wallet/new", (req, res) => {
  try {
    const newWallet = ethers.Wallet.createRandom();

    res.json({
      address: newWallet.address,
      privateKey: newWallet.privateKey, // ⚠️ return only for dev/testing
      mnemonic: newWallet.mnemonic?.phrase,
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
      chain:"0xaa36a7", // eth testnet
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

    res.json({ hash: txResponse.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- WEBHOOK ROUTE ----------
// Moralis will POST here when you register the webhook in the Moralis dashboard
app.post("/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    console.log("🔔 Webhook received:", JSON.stringify(webhookData, null, 2));

    // Example: check if it's a transaction
    if (webhookData.confirmed && webhookData.txs) {
      webhookData.txs.forEach((tx) => {
        console.log(`✅ Transaction detected! Hash: ${tx.hash}`);
        console.log(`From: ${tx.fromAddress} To: ${tx.toAddress}`);
        console.log(`Value: ${ethers.formatEther(tx.value)} ETH`);
      });
    }

    // Always respond quickly
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
