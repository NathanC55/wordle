const wordOfTheDay = "gamer";
let tries = 0;
let guess = 0;
let row = 1;
const letter = /^[a-zA-Z]+$/;
document.addEventListener("keyup", (event) => {
  const wordRow = document.querySelector(`.row-${row}`);
  const letterContainer = wordRow?.querySelector(`.letter-${guess}`);
  const keyClicked: string = event.key;
  const previousLetterContainer = wordRow?.querySelector(
    `.letter-${guess - 1}`
  );

  if (
    letterContainer != undefined &&
    letter.test(keyClicked) === true &&
    keyClicked.length === 1
  ) {
    letterContainer.innerHTML = keyClicked;
    if (guess === 5) {
      return;
    }
    guess++;
  }

  if (keyClicked === "Backspace") {
    // need to delete previous letter
    if (guess === 0) {
      return;
    }
    if (previousLetterContainer != undefined) {
      previousLetterContainer.innerHTML = " ";
    }

    guess = guess - 1;
  }

  console.log(guess);
});
