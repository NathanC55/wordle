import { clearBoardAlert, hardModeSwitch } from "./components/settings";
import { hardWords } from "./assets/hard_words";
import { easyWords } from "./assets/easy_words";
import { loadStatistics } from "./components/statistics";
import "./styles/main.css";
import "./styles/settings.css";
import "./styles/statistics.css";

let wordList: string[] = [];
const hardModeCheck = () => {
  if (JSON.parse(localStorage.getItem("hardmode")) === true) {
    wordList = hardWords;
    hardModeSwitch.checked = true;
    return;
  }
  wordList = easyWords;
  hardModeSwitch.checked = false;
};
hardModeCheck();

let realWords: string[] = hardWords;
let wordOfTheDay = localStorage.getItem("word");
export let wins: number = Number(localStorage.getItem("wins")) || 0;
export let losses: number = Number(localStorage.getItem("losses")) || 0;
export let streak: number = Number(localStorage.getItem("streak")) || 0;
let tries: number = Number(localStorage.getItem("tries")) || 0;
let keysClicked = 0;
let row: number = Number(localStorage.getItem("row")) || 1;
export let guessedWords: string[] = JSON.parse(
  localStorage.getItem("guessedWords") || "[]"
);
const letter = /^[a-zA-Z]+$/;
const fullKeyBoard = document.querySelectorAll(".letter-button");

document.addEventListener("keyup", keyUpEvent);

fullKeyBoard.forEach((buttonElement) => {
  buttonElement.addEventListener("click", (event) => {
    const button: string = buttonElement.innerHTML;

    document.dispatchEvent(new KeyboardEvent("keyup", { key: button }));
  });
});

const clearLocalStorage = (item: string) => {
  localStorage.setItem(item, "");
};
const updateLocalStorage = (key: string, value: number) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const deactivateGame = () => {
  document.removeEventListener("keyup", keyUpEvent);
};

function wordCheck(word: string, wordRow: Element | null, correctCount = 0) {
  for (let x = 0; x < 5; x++) {
    if (wordOfTheDay != null) {
      const letterClass =
        wordOfTheDay[x] === word[x]
          ? "correct"
          : wordOfTheDay.includes(word[x])
            ? "incorrect-spot"
            : "wrong";

      const currentElement = wordRow?.querySelector(`.letter-${x}`);
      const buttonElement = document.querySelector(
        `.${word[x].toLocaleUpperCase()}`
      );

      if (currentElement) {
        setTimeout(() => {
          currentElement.classList.add(letterClass);
          currentElement.classList.add(`flip`);
        }, x * 400);
        setTimeout(() => {
          buttonElement?.classList.add(`${letterClass}`);
        }, 6 * 400);
      }
      if (typeof correctCount !== undefined) {
        correctCount += wordOfTheDay[x] === word[x] ? 1 : 0;
      }
    }
  }
  return correctCount;
}

function saveGuessedWord(word: string) {
  if (guessedWords === undefined) {
    guessedWords = [];
  }

  guessedWords.push(word);
  localStorage.setItem("guessedWords", JSON.stringify(guessedWords));
}

guessedWords.forEach((guessedWord, index) => {
  const wordRow = document.querySelector(`.row-${index + 1}`);
  for (let x = 0; x < 5; x++) {
    const letterContainer = wordRow?.querySelector(`.letter-${x}`);
    if (letterContainer) {
      letterContainer.innerHTML = guessedWord[x];
    }
  }
  if (wordCheck(guessedWord, wordRow) === 5) {
    console.log("hey");
    deactivateGame();
  }
});

const generateNewWordButton =
  document.querySelector<HTMLButtonElement>(".word-generator");

export function generateNewWord() {
  if (localStorage.getItem("guessedWords")) {
    clearBoardAlert.showModal();
    return;
  }
  const fiveLetterWords = wordList.filter((word) => word.length === 5);
  let newWord =
    fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
  localStorage.setItem("word", newWord);
  wordOfTheDay = newWord;
  row = 1;
  tries = 0;
  updateLocalStorage("row", row);
  updateLocalStorage("tries", tries);
  clearLocalStorage("guessedWords");

  location.reload();
}

generateNewWordButton.addEventListener("click", generateNewWord);

function keyUpEvent(event: any) {
  const wordRow = document.querySelector(`.row-${row}`);
  const letterContainer = wordRow?.querySelector(`.letter-${keysClicked}`);
  const clickedKey: string = event.key.toLocaleLowerCase();
  const previousLetterContainer = wordRow?.querySelector(
    `.letter-${keysClicked - 1}`
  );
  let fullWord = "";

  //handles clicked letters
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
    if (keysClicked === 0) {
      return;
    }
    if (previousLetterContainer != undefined) {
      previousLetterContainer.innerHTML = " ";
    }

    keysClicked = keysClicked - 1;
  }

  // handles Enter
  if (clickedKey === "enter") {
    for (let x = 0; x < 5; x++) {
      fullWord += wordRow?.querySelector(`.letter-${x}`)?.innerHTML;
    }

    if (realWords.includes(fullWord)) {
      saveGuessedWord(fullWord);

      if (wordCheck(fullWord, wordRow) === 5) {
        deactivateGame();

        console.log("you win");
        wins += 1;
        streak += 1;

        updateLocalStorage("wins", wins);
        updateLocalStorage("streak", streak);
        loadStatistics();

        return;
      }

      row = row + 1;
      updateLocalStorage("row", row);
      tries += 1;
      updateLocalStorage("tries", tries);

      if (tries === 6) {
        deactivateGame();
        losses += 1;
        streak = 0;
        updateLocalStorage("losses", losses);
        updateLocalStorage("streak", streak);
        loadStatistics();
        console.log("you lose");
      }

      keysClicked = 0;
    }
  }
}

if (!wordOfTheDay) {
  generateNewWord();
}
