const connectBtn = document.getElementById("connectBtn");
const buyBtn = document.getElementById("buyBtn");
const usdtAmount = document.getElementById("usdtAmount");
const tokenAmount = document.getElementById("tokenAmount");
const msg = document.getElementById("msg");

const currentPriceEl = document.getElementById("currentPrice");
const nextPriceEl = document.getElementById("nextPrice");
const totalSoldEl = document.getElementById("totalSold");
const nextAfterEl = document.getElementById("nextAfter");
const progressBar = document.getElementById("progressBar");
const stagePercent = document.getElementById("stagePercent");

const historyBody = document.getElementById("historyBody");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const BASE_PRICE = 0.05;
const STEP_SIZE = 10000;
const STEP_INCREASE = 0.025;

let totalSold = Number(localStorage.getItem("totalSold")) || 0;
let history = JSON.parse(localStorage.getItem("buyHistory")) || [];

function getCurrentPrice() {
  const level = Math.floor(totalSold / STEP_SIZE);
  return BASE_PRICE + level * STEP_INCREASE;
}

function getNextPrice() {
  return getCurrentPrice() + STEP_INCREASE;
}

function getNextPriceAfter() {
  const nextLevel = Math.floor(totalSold / STEP_SIZE) + 1;
  return nextLevel * STEP_SIZE;
}

function calculateTokens(usdt) {
  return usdt / getCurrentPrice();
}

function updateUI() {
  const currentPrice = getCurrentPrice();

  currentPriceEl.innerText = "$" + currentPrice.toFixed(3);
  nextPriceEl.innerText = "$" + getNextPrice().toFixed(3);
  totalSoldEl.innerText = totalSold.toFixed(2) + " STX";
  nextAfterEl.innerText = getNextPriceAfter().toLocaleString() + " STX";

  const currentStageSold = totalSold % STEP_SIZE;
  const percent = (currentStageSold / STEP_SIZE) * 100;

  progressBar.style.width = percent + "%";
  stagePercent.innerText = percent.toFixed(1) + "%";
}

function renderHistory() {
  historyBody.innerHTML = "";

  if (history.length === 0) {
    historyBody.innerHTML = `
      <tr>
        <td colspan="4">No buy history yet</td>
      </tr>
    `;
    return;
  }

  history.slice().reverse().forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.time}</td>
      <td>${item.usdt} USDT</td>
      <td>${item.tokens} STX</td>
      <td>$${item.price}</td>
    `;

    historyBody.appendChild(tr);
  });
}

connectBtn.addEventListener("click", () => {
  connectBtn.innerText = "Wallet Connected";
  msg.innerText = "Demo wallet connected. Smart contract later add hoga.";
});

usdtAmount.addEventListener("input", () => {
  const usdt = Number(usdtAmount.value);

  if (usdt > 0) {
    tokenAmount.value = calculateTokens(usdt).toFixed(2) + " STX";
  } else {
    tokenAmount.value = "";
  }
});

buyBtn.addEventListener("click", () => {
  const usdt = Number(usdtAmount.value);

  if (!usdt || usdt <= 0) {
    msg.innerText = "Please enter valid USDT amount.";
    return;
  }

  const priceBeforeBuy = getCurrentPrice();
  const tokens = calculateTokens(usdt);

  totalSold += tokens;

  const buyData = {
    time: new Date().toLocaleString(),
    usdt: usdt.toFixed(2),
    tokens: tokens.toFixed(2),
    price: priceBeforeBuy.toFixed(3)
  };

  history.push(buyData);

  localStorage.setItem("totalSold", totalSold);
  localStorage.setItem("buyHistory", JSON.stringify(history));

  msg.innerHTML = `
    Bought: <b>${tokens.toFixed(2)} STX</b><br>
    Paid: <b>${usdt.toFixed(2)} USDT</b><br>
    Buy Price: <b>$${priceBeforeBuy.toFixed(3)}</b>
  `;

  usdtAmount.value = "";
  tokenAmount.value = "";

  updateUI();
  renderHistory();
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  totalSold = 0;

  localStorage.removeItem("buyHistory");
  localStorage.removeItem("totalSold");

  updateUI();
  renderHistory();

  msg.innerText = "Demo history cleared.";
});

updateUI();
renderHistory();