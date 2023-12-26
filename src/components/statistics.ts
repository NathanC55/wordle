const statsDialog = document.querySelector<HTMLDialogElement>(".stats");
const showStats = document.querySelector(".statistics-button");
const closeStats = document.querySelector(".close-stats");

const totalGamesPlayed = document.getElementById("total-games-played");
const totalWins = document.getElementById("total-wins");
const totalLosses = document.getElementById("total-losses");
const totalStreaks = document.getElementById("streak");

showStats?.addEventListener("click", () => {
  statsDialog?.showModal();
});

closeStats?.addEventListener("click", () => {
  statsDialog?.close();
});

function loadStatistics() {
  if (
    totalGamesPlayed != null &&
    totalLosses != null &&
    totalWins != null &&
    totalStreaks != null
  ) {
    let gamesPlayed = wins + losses;
    totalGamesPlayed.innerHTML = `<div class="number">${gamesPlayed}</div><div class="font">Played</div>`;

    totalWins.innerHTML = `<div class="number">${wins}</div><div class="font">Wins</div>`;

    totalLosses.innerHTML = `<div class="number">${losses}</div><div class="font">Losses</div>`;

    totalStreaks.innerHTML = `<div class="number">${streak}</div><div class="font">Streak</div>`;
  }
}

loadStatistics();
