// clear board when generating a new word
// keep board when reloading page
// deal with bug, when winning game, it lets you effect the word if page is refreshed
let wordOfTheDay = localStorage.getItem("word");
let wins: number = Number(localStorage.getItem("wins"));
let losses: number = Number(localStorage.getItem("losses"));
let streak: number = Number(localStorage.getItem("streak"));
let tries = 0;
let keysClicked = 0;
let row: number = Number(localStorage.getItem("row")) || 1;
let guessedWords: string[] = JSON.parse(
  localStorage.getItem("guessedWords") || "[]"
);

const letter = /^[a-zA-Z]+$/;
const fullKeyBoard = document.querySelectorAll(".letter-button");

const updateWinItem = () => {
  localStorage.setItem("wins", JSON.stringify(wins));
  localStorage.setItem("streak", JSON.stringify(streak));
};
const updateLossItem = () => {
  localStorage.setItem("losses", JSON.stringify(wins));
  localStorage.setItem("streak", JSON.stringify(streak));
};
const updateRowItem = () => {
  localStorage.setItem("row", JSON.stringify(row));
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
        console.log(correctCount);
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
  console.log(guessedWords);
}
guessedWords.forEach((guessedWord, index) => {
  const wordRow = document.querySelector(`.row-${index + 1}`);
  for (let x = 0; x < 5; x++) {
    const letterContainer = wordRow?.querySelector(`.letter-${x}`);
    if (letterContainer) {
      letterContainer.innerHTML = guessedWord[x];
    }

    wordCheck(guessedWord, wordRow);
  }
});

fullKeyBoard.forEach((buttonElement) => {
  buttonElement.addEventListener("click", (event) => {
    const button: string = buttonElement.innerHTML;

    document.dispatchEvent(new KeyboardEvent("keyup", { key: button }));
  });
});

function main(words: string[]) {
  // keep in main function----------
  const generateNewWordButton = document.querySelector(".word-generator");

  function generateNewWord() {
    const fiveLetterWords = words.filter((word) => word.length === 5);
    let newWord =
      fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    localStorage.setItem("word", newWord);
    wordOfTheDay = newWord;
  }

  if (!wordOfTheDay) {
    generateNewWord();
  }

  generateNewWordButton?.addEventListener("click", () => {
    generateNewWord();
  });
  // end -------------------------

  document.addEventListener("keyup", function keyUpEvent(event) {
    const wordRow = document.querySelector(`.row-${row}`);
    const letterContainer = wordRow?.querySelector(`.letter-${keysClicked}`);
    const clickedKey: string = event.key.toLocaleLowerCase();
    const previousLetterContainer = wordRow?.querySelector(
      `.letter-${keysClicked - 1}`
    );
    let fullWord = "";
    const deactivateGame = () => {
      document.removeEventListener("keyup", keyUpEvent);
    };
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

      if (words.includes(fullWord)) {
        saveGuessedWord(fullWord);

        if (wordCheck(fullWord, wordRow) === 5) {
          deactivateGame();

          console.log("you win");
          wins += 1;
          streak += 1;

          updateWinItem();
          loadStatistics();

          return;
        }

        row = row + 1;
        updateRowItem();
        tries += 1;

        if (tries === 6) {
          deactivateGame();
          losses += 1;
          streak = 0;
          updateLossItem();
          loadStatistics();
          console.log("you lose");
        }

        keysClicked = 0;
      }
    }
  });
}

fetch("/src/assets/wordList.json")
  .then((response) => response.json())
  .then((data) => {
    // Use data as needed

    main(data);
  })
  .catch((error) => console.error("Error loading JSON:", error));
