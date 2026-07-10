const demoDashboard = {
  totalStake: "$12,500",
  totalWithdrawal: "$3,200",
  totalBusiness: "$84,700",
  totalUser: "326",
  selfMining: "$420",
  levelMining: "$1,850",
  rank: "Gold",
  rankIncome: "$700",
  extraReward: "$250",
  rewardIncome: "$1,120",
  royalty: "$530",
  history: [
    { date: "2026-06-23", type: "Stake", amount: "$500", status: "Success" },
    { date: "2026-06-22", type: "Self Mining", amount: "$35", status: "Credited" },
    { date: "2026-06-21", type: "Level Mining", amount: "$120", status: "Credited" },
    { date: "2026-06-20", type: "Withdrawal", amount: "$250", status: "Success" },
    { date: "2026-06-19", type: "Rank Income", amount: "$300", status: "Credited" }
  ]
};

function loginUser() {
  const username = document.getElementById("username").value.trim();
  const wallet = document.getElementById("wallet").value.trim();
  const referral = document.getElementById("referral").value.trim();

  if (!username || !wallet) {
    alert("Username aur wallet address enter karo");
    return;
  }

  localStorage.setItem("stakex_user", JSON.stringify({
    username,
    wallet,
    referral
  }));

  window.location.href = "dashboard.html";
}

function loadDashboard() {
  const userData = localStorage.getItem("stakex_user");

  if (!userData) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userData);

  setText("userInfo", `${user.username} | ${shortWallet(user.wallet)}`);
  setText("rankBadge", demoDashboard.rank);

  setText("totalStake", demoDashboard.totalStake);
  setText("totalWithdrawal", demoDashboard.totalWithdrawal);
  setText("totalBusiness", demoDashboard.totalBusiness);
  setText("totalUser", demoDashboard.totalUser);
  setText("selfMining", demoDashboard.selfMining);
  setText("levelMining", demoDashboard.levelMining);
  setText("rankIncome", demoDashboard.rankIncome);
  setText("extraReward", demoDashboard.extraReward);
  setText("rewardIncome", demoDashboard.rewardIncome);
  setText("royalty", demoDashboard.royalty);

  const tbody = document.getElementById("historyTable");
  if (tbody) {
    tbody.innerHTML = "";
    demoDashboard.history.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.date}</td>
          <td>${item.type}</td>
          <td>${item.amount}</td>
          <td>${item.status}</td>
        </tr>
      `;
    });
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = value;
  }
}

function shortWallet(wallet) {
  if (!wallet || wallet.length < 12) return wallet;
  return wallet.slice(0, 6) + "..." + wallet.slice(-4);
}

function logout() {
  localStorage.removeItem("stakex_user");
  window.location.href = "login.html";
}

if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}