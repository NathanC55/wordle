let words: string[] = [];

fetch("/src/assets/wordList.json")
  .then((response) => response.json())
  .then((data) => {
    // Use data as needed
    words = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

let wordOfTheDay = "gamer";

// function generateNewWord() {
//   wordOfTheDay = words[Math.floor(Math.random() * words.length)];
//   localStorage.setItem("word", wordOfTheDay);
//   return wordOfTheDay;
// }

let tries = 0;
let guess = 0;
let row = 1;

const letter = /^[a-zA-Z]+$/;
const buttonsContainer = document.querySelector(".buttons-container");
const keyboard = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

keyboard.forEach((keyBoardRow) => {
  keyBoardRow.forEach((key) => {
    if (buttonsContainer != undefined) {
      buttonsContainer.innerHTML += `<button class='letter-button'>${key}</button>`;
    }
  });
  if (buttonsContainer != undefined) {
    buttonsContainer.innerHTML += `<br>`;
  }
});

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
  const letterContainer = wordRow?.querySelector(`.letter-${guess}`);
  const keyClicked: string = event.key.toLocaleLowerCase();
  const previousLetterContainer = wordRow?.querySelector(
    `.letter-${guess - 1}`
  );
  let fullWord = "";
  let correctCount = 0;
  //handles letters
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

  //handles backspace
  if (keyClicked === "backspace") {
    // need to delete previous letter
    if (guess === 0) {
      return;
    }
    if (previousLetterContainer != undefined) {
      previousLetterContainer.innerHTML = " ";
    }

    guess = guess - 1;
  }

  // handles Enter: which checks if word is real
  if (keyClicked === "enter") {
    for (let x = 0; x < 5; x++) {
      fullWord += wordRow?.querySelector(`.letter-${x}`)?.innerHTML;
    }

    if (words.includes(fullWord)) {
      // in here right code to compare guessed word to wordOfTheDay

      for (let y = 0; y < 5; y++) {
        //checks if same spot
        if (wordOfTheDay[y] === fullWord[y]) {
          wordRow?.querySelector(`.letter-${y}`)?.classList.add("correct");
          correctCount += 1;
        } else if (wordOfTheDay.includes(fullWord[y])) {
          wordRow
            ?.querySelector(`.letter-${y}`)
            ?.classList.add("incorrect-spot");
        } else {
          wordRow?.querySelector(`.letter-${y}`)?.classList.add("wrong");
        }
      }

      if (correctCount === 5) {
        document.removeEventListener("keyup", keyUpEvent);
        console.log("you win");
      }

      row = row + 1;
      guess = 0;
      tries += 1;
      if (tries === 6) {
        document.removeEventListener("keyup", keyUpEvent);
        console.log("you lose");
      }
    }
  }
});
