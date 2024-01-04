const settingsDialog = document.querySelector<HTMLDialogElement>(".settings");
const showSettings = document.querySelector(".settings-button");
const closeSettings = document.querySelector(".close-settings");

showSettings?.addEventListener("click", () => {
  settingsDialog?.showModal();
});

closeSettings?.addEventListener("click", () => {
  settingsDialog?.close();
});

const hardModeSwitch = document.querySelector<HTMLInputElement>(".hardmode");

hardModeSwitch?.addEventListener("change", () => {
  hardModeSwitch.classList.toggle("on");
});
