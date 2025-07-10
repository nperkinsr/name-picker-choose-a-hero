const cardElement = document.getElementById("character-card");
const generateCharacterButton = document.getElementById("generate-btn");
const closeCharacterButton = document.getElementById("close-btn");
const characterTextElement = document.getElementById("character-result");
const textarea = document.querySelector(".name-picker textarea");

let characterData;

/////////////////////////////////////////////////////
//////////       DATA LOADING       /////////////
/////////////////////////////////////////////////////

function loadCharacterData() {
  fetch("characterOptions.json")
    .then((response) => response.json())
    .then((data) => {
      characterData = data;
    });
}

/////////////////////////////////////////////////////
//////////       UTILITIES       /////////////
/////////////////////////////////////////////////////

function getRandomItemFromList(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function getRandomNameFromTextarea() {
  const names = textarea.value
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  if (names.length === 0) return null;
  return getRandomItemFromList(names);
}

// Adds a line of text with fade-in animation
function appendFadeInLine(htmlContent) {
  const line = document.createElement("div");
  line.className = "fade-in-line";
  line.innerHTML = htmlContent;
  characterTextElement.appendChild(line);

  // Trigger reflow so the animation re-applies even on repeated elements
  void line.offsetWidth;
}

function clearCharacterResult() {
  characterTextElement.innerHTML = "";
}

function createRandomCharacterDescription() {
  const adjective = getRandomItemFromList(characterData.adjectives);
  const type = getRandomItemFromList(characterData.types);
  const quirk = getRandomItemFromList(characterData.quirks);
  return `They are <span class="character">${adjective} ${type} ${quirk}</span>.`;
}

function getRandomTitle() {
  return getRandomItemFromList(characterData.titles);
}

/////////////////////////////////////////////////////
//////////       CHARACTER DISPLAY       /////////////
/////////////////////////////////////////////////////

async function showCharacterOnCardBack() {
  clearCharacterResult();
  cardElement.classList.add("flipped");

  const chosenName = getRandomNameFromTextarea();

  if (!chosenName) {
    characterTextElement.innerHTML =
      "<span style='color:red;'>Please enter at least one name into the text field.</span>";
    return;
  }

  appendFadeInLine("A name begins to form…");

  await new Promise((res) => setTimeout(res, 2000));
  appendFadeInLine(
    "The new hero has been chosen. Their role has been assigned."
  );

  await new Promise((res) => setTimeout(res, 3500));
  const description = createRandomCharacterDescription();
  appendFadeInLine(description);

  await new Promise((res) => setTimeout(res, 4500));
  const title = getRandomTitle();
  appendFadeInLine(
    `The world will be saved by: <span class="character-name">${chosenName}</span>, <span class="character-title">${title}</span>`
  );
}

function showCardFront() {
  cardElement.classList.remove("flipped");
}

/////////////////////////////////////////////////////
//////////       EVENT LISTENERS       /////////////
/////////////////////////////////////////////////////

generateCharacterButton.addEventListener("click", showCharacterOnCardBack);
closeCharacterButton.addEventListener("click", showCardFront);

loadCharacterData();
