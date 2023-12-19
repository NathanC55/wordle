let words: string[] = [];

// add new word generator
// keep tack of wins and loses
// add keyboard colors

fetch("/src/assets/wordList.json")
  .then((response) => response.json())
  .then((data) => {
    // Use data as needed
    words = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

// function generateNewWord() {
//   wordOfTheDay = words[Math.floor(Math.random() * words.length)];
//   localStorage.setItem("word", wordOfTheDay);
//   return wordOfTheDay;
// }
let wordOfTheDay = "gamer";
let tries = 0;
let keysClicked = 0;
let row = 1;

const letter = /^[a-zA-Z]+$/;
const fullKeyBoard = document.querySelectorAll(".letter-button");

fullKeyBoard.forEach((buttonElement) => {
  buttonElement.addEventListener("click", (event) => {
    const button: string = buttonElement.innerHTML;

    document.dispatchEvent(new KeyboardEvent("keyup", { key: button }));
    console.log(button);
  });
});

document.addEventListener("keyup", function keyUpEvent(event) {
  const wordRow = document.querySelector(`.row-${row}`);
  const letterContainer = wordRow?.querySelector(`.letter-${keysClicked}`);
  const clickedKey: string = event.key.toLocaleLowerCase();
  const previousLetterContainer = wordRow?.querySelector(
    `.letter-${keysClicked - 1}`
  );
  let fullWord = "";
  let correctCount = 0;
  //handles letters
  if (
    letterContainer != undefined &&
    letter.test(clickedKey) === true &&
    clickedKey.length === 1
  ) {
    letterContainer.innerHTML = clickedKey;
    if (keysClicked === 5) {
      return;
    }

    keysClicked++;
  }

  //handles backspace
  if (clickedKey === "backspace") {
    // need to delete previous letter
    if (keysClicked === 0) {
      return;
    }
    if (previousLetterContainer != undefined) {
      previousLetterContainer.innerHTML = " ";
    }

    keysClicked = keysClicked - 1;
  }

  function wordCheck() {
    for (let y = 0; y < 5; y++) {
      const letterClass =
        wordOfTheDay[y] === fullWord[y]
          ? "correct"
          : wordOfTheDay.includes(fullWord[y])
          ? "incorrect-spot"
          : "wrong";

      const currentElement = wordRow?.querySelector(`.letter-${y}`);

      if (currentElement) {
        setTimeout(() => {
          currentElement.classList.add(letterClass);
          currentElement.classList.add(`flip`);
        }, y * 400);
      }

      correctCount += wordOfTheDay[y] === fullWord[y] ? 1 : 0;
    }
  }

  // handles Enter: which checks if word is real
  if (clickedKey === "enter") {
    for (let x = 0; x < 5; x++) {
      fullWord += wordRow?.querySelector(`.letter-${x}`)?.innerHTML;
    }

    if (words.includes(fullWord)) {
      // in here right code to compare guessed word to wordOfTheDay
      wordCheck();
      if (correctCount === 5) {
        document.removeEventListener("keyup", keyUpEvent);

        console.log("you win");
        return;
      }

      row = row + 1;
      tries += 1;

      if (tries === 6) {
        document.removeEventListener("keyup", keyUpEvent);
        console.log("you lose");
      }

      keysClicked = 0;
    }
  }
});
