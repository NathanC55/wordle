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
    totalGamesPlayed.innerHTML = `${gamesPlayed} Total Games Played`;
    totalWins.innerHTML = `${wins} Total Wins`;
    totalLosses.innerHTML = `${losses} Total Losses`;
    totalStreaks.innerHTML = `${streak} Win Streak`;
  }
}

loadStatistics();
