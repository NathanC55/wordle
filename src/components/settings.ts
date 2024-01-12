import { generateNewWord, hardModeCheck } from "..";

const settingsDialog = document.querySelector<HTMLDialogElement>(".settings");
const showSettings = document.querySelector(".settings-button");
const closeSettings = document.querySelector(".close-settings");

export const clearBoardAlert = document.querySelector<HTMLDialogElement>(".clearing-board-alert");

const continueButton = clearBoardAlert.querySelector(".clear-board-continue");
const cancelButton = clearBoardAlert.querySelector(".clear-board-cancel");

export const hardModeSwitch = document.querySelector<HTMLInputElement>(".hardmode-switch");
let toggleHTMLInput = false;

export const handleToggleHTMLInput = (value: boolean) => {
  toggleHTMLInput = value;
};

const hardModeSwitchToggle = () => {
  if (toggleHTMLInput) {
    hardModeSwitch.checked = !hardModeSwitch.checked;
  }
};

continueButton.addEventListener("click", () => {
  localStorage.setItem("guessedWords", "");
  //set difficulty
  localStorage.setItem("hardmode", JSON.stringify(hardModeSwitch.checked));
  generateNewWord();
});

cancelButton.addEventListener("click", () => {
  clearBoardAlert.close();
  hardModeSwitchToggle();
});

showSettings?.addEventListener("click", () => {
  settingsDialog?.showModal();
});

closeSettings?.addEventListener("click", () => {
  settingsDialog?.close();
});

export const hasGuessedWords = localStorage.getItem("guessedWords") !== "";
hardModeSwitch?.addEventListener("change", () => {
  if (hasGuessedWords) {
    handleToggleHTMLInput(true);
    clearBoardAlert.showModal();
    return;
  }

  localStorage.setItem("hardmode", JSON.stringify(hardModeSwitch.checked));
  generateNewWord();
});
