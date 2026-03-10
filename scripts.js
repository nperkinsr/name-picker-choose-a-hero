const cardElement = document.getElementById("character-card");
const generateButton = document.getElementById("generate-btn");
const closeButton = document.getElementById("close-btn");
const resultElement = document.getElementById("character-result");
const namesTextarea = document.querySelector(".name-picker textarea");

const REVEAL_STEPS = [
  { delay: 2000, content: "A name begins to form..." },
  {
    delay: 3500,
    content: "The new hero has been chosen. Their role has been assigned.",
  },
  {
    delay: 3500,
    content: ({ description }) => description,
  },
  {
    delay: 5000,
    content: ({ name, title }) =>
      `The world will be saved by: <span class="character-name">${name}</span>, <span class="character-title">${title}</span>`,
  },
];

let characterData = null;
let isRevealing = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getEnteredNames() {
  return namesTextarea.value
    .split("\n")
    .map((name) => toTitleCase(name.trim()))
    .filter(Boolean);
}

function appendFadeInLine(html) {
  const line = document.createElement("div");
  line.className = "fade-in-line";
  line.innerHTML = html;
  resultElement.appendChild(line);
}

function clearCharacterResult() {
  resultElement.textContent = "";
}

function buildCharacterDescription() {
  const adjective = getRandomItem(characterData.adjectives);
  const type = getRandomItem(characterData.types);
  const quirk = getRandomItem(characterData.quirks);

  return `They are <span class="character">${adjective} ${type} ${quirk}</span>.`;
}

function buildCharacterState(name) {
  return {
    name,
    title: getRandomItem(characterData.titles),
    description: buildCharacterDescription(),
  };
}

function showValidationError() {
  resultElement.innerHTML =
    "<span style='color:red;'>Please enter at least one name into the text field.</span>";
}

async function revealCharacter(state) {
  for (const step of REVEAL_STEPS) {
    if (step.delay > 0) {
      await delay(step.delay);
    }

    const content =
      typeof step.content === "function" ? step.content(state) : step.content;

    appendFadeInLine(content);
  }
}

async function showCharacterOnCardBack() {
  if (isRevealing) {
    return;
  }

  isRevealing = true;
  generateButton.disabled = true;
  clearCharacterResult();
  cardElement.classList.add("flipped");

  try {
    if (!characterData) {
      resultElement.innerHTML =
        "<span style='color:red;'>Character options failed to load.</span>";
      return;
    }

    const names = getEnteredNames();

    if (names.length === 0) {
      showValidationError();
      return;
    }

    const selectedName = getRandomItem(names);
    const characterState = buildCharacterState(selectedName);

    await revealCharacter(characterState);
  } finally {
    isRevealing = false;
    generateButton.disabled = false;
  }
}

function showCardFront() {
  cardElement.classList.remove("flipped");
}

async function loadCharacterData() {
  const response = await fetch("characterOptions.json");
  characterData = await response.json();
}

generateButton.addEventListener("click", showCharacterOnCardBack);
closeButton.addEventListener("click", showCardFront);

loadCharacterData().catch(() => {
  resultElement.innerHTML =
    "<span style='color:red;'>Character options failed to load.</span>";
});
