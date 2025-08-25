class Block {
  constructor(index, prevHash, data, nonce = 0) {
    this.index = index;
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = Date.now();
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
  }

  mine(difficulty) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 3;
  }

  createGenesis() {
    return new Block(0, "0", "Genesis Block");
  }

  getLatest() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatest().hash;
    newBlock.mine(this.difficulty);
    this.chain.push(newBlock);
  }
}

const myChain = new Blockchain();
let myWallet = null;

function generateWallet() {
  myWallet = "WALLET-" + Math.random().toString(36).substring(2, 10);
  document.getElementById("wallet").innerText = "💳 Wallet: " + myWallet;
}

function mineBlock() {
  if (!myWallet) return alert("Generate wallet first!");
  const reward = { to: myWallet, amount: 50 };
  const block = new Block(myChain.chain.length, myChain.getLatest().hash, reward);
  myChain.addBlock(block);
  document.getElementById("status").innerText = "✅ Block mined! Reward 50 MyCoin";
  document.getElementById("chain").innerText = JSON.stringify(myChain, null, 2);
}

// Simple SHA256 hash function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
