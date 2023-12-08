let words: string[] = [];

fetch("/src/assets/wordList.json")
  .then((response) => response.json())
  .then((data) => {
    // Use data as needed
    words = data;
    console.log(data);
  })
  .catch((error) => console.error("Error loading JSON:", error));

const wordOfTheDay = "gamer";
const wordList = ["gamer", "audio", "yoink"];
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
  let fullWord = "";

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

  if (keyClicked === "Enter") {
    for (let x = 0; x < 5; x++) {
      fullWord += wordRow?.querySelector(`.letter-${x}`)?.innerHTML;
    }

    if (words.includes(fullWord)) {
      row = row + 1;
      guess = 0;
    }
  }

  console.log(guess);
});
