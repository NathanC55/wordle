import { generateNewWord } from "..";

const settingsDialog = document.querySelector<HTMLDialogElement>(".settings");
const showSettings = document.querySelector(".settings-button");
const closeSettings = document.querySelector(".close-settings");

export const clearBoardAlert = document.querySelector<HTMLDialogElement>(
  ".clearing-board-alert"
);

const continueButton = clearBoardAlert.querySelector(".clear-board-continue");
const cancelButton = clearBoardAlert.querySelector(".clear-board-cancel");

continueButton.addEventListener("click", () => {
  localStorage.setItem("guessedWords", "");
  generateNewWord();
});

cancelButton.addEventListener("click", () => {
  clearBoardAlert.close();
});

showSettings?.addEventListener("click", () => {
  settingsDialog?.showModal();
});

closeSettings?.addEventListener("click", () => {
  settingsDialog?.close();
});

export const hardModeSwitch =
  document.querySelector<HTMLInputElement>(".hardmode-switch");

hardModeSwitch?.addEventListener("change", () => {
  localStorage.setItem("hardmode", JSON.stringify(hardModeSwitch.checked));
  if (localStorage.getItem("guessedWords") != "") {
    clearBoardAlert.showModal();
    console.log("guessed words");
    return;
  }
  generateNewWord();
});
