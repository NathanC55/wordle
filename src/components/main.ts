// add keyboard colors
// clear board when generating a new word
// keep board when reloading page
let wins: number = Number(localStorage.getItem("wins"));
let losses: number = Number(localStorage.getItem("losses"));
let streak: number = Number(localStorage.getItem("streak"));

function main(words: string[]) {
  const generateNewWordButton = document.querySelector(".word-generator");

  generateNewWordButton?.addEventListener("click", () => {
    generateNewWord();
  });

  function generateNewWord() {
    const fiveLetterWords = words.filter((word) => word.length === 5);
    let newWord =
      fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    localStorage.setItem("word", newWord);
    wordOfTheDay = newWord;
    console.log(newWord);
  }

  let wordOfTheDay = localStorage.getItem("word");

  if (!wordOfTheDay) {
    generateNewWord();
  }

  let tries = 0;
  let keysClicked = 0;
  let row = 1;

  const letter = /^[a-zA-Z]+$/;
  const fullKeyBoard = document.querySelectorAll(".letter-button");

  fullKeyBoard.forEach((buttonElement) => {
    buttonElement.addEventListener("click", (event) => {
      const button: string = buttonElement.innerHTML;

      document.dispatchEvent(new KeyboardEvent("keyup", { key: button }));
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
        if (wordOfTheDay != null) {
          const letterClass =
            wordOfTheDay[y] === fullWord[y]
              ? "correct"
              : wordOfTheDay.includes(fullWord[y])
              ? "incorrect-spot"
              : "wrong";

          const currentElement = wordRow?.querySelector(`.letter-${y}`);
          const buttonElement = document.querySelector(
            `.${fullWord[y].toLocaleUpperCase()}`
          );

          if (currentElement) {
            setTimeout(() => {
              currentElement.classList.add(letterClass);
              currentElement.classList.add(`flip`);
            }, y * 400);
            setTimeout(() => {
              buttonElement?.classList.add(`${letterClass}`);
            }, 6 * 400);
          }

          correctCount += wordOfTheDay[y] === fullWord[y] ? 1 : 0;
        }
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
          wins += 1;
          streak += 1;
          localStorage.setItem("wins", JSON.stringify(wins));
          localStorage.setItem("streak", JSON.stringify(streak));
          loadStatistics();
          return;
        }

        row = row + 1;
        tries += 1;

        if (tries === 6) {
          document.removeEventListener("keyup", keyUpEvent);
          losses += 1;
          localStorage.setItem("losses", JSON.stringify(losses));
          streak = 0;
          localStorage.setItem("streak", JSON.stringify(streak));
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
