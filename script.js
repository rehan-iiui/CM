/* =========================================================
   CITY MANAGER SIMULATOR
   VERSION 1 — CORE 2D CITY ENGINE
   ========================================================= */

/* =========================================================
   MAP SETTINGS
========================================================= */

const MAP_COLUMNS = 24;
const MAP_ROWS = 15;
const TOTAL_TILES = MAP_COLUMNS * MAP_ROWS;


/* =========================================================
   BUILDING DATA
========================================================= */

const BUILDINGS = {

  road: {
    name: "Road",
    icon: "🛣️",
    cost: 100,
    population: 0,
    jobs: 0,
    income: 0,
    expense: 2
  },

  house: {
    name: "House",
    icon: "🏠",
    cost: 1000,
    population: 4,
    jobs: 0,
    income: 0,
    expense: 5
  },

  shop: {
    name: "Shop",
    icon: "🛒",
    cost: 2500,
    population: 0,
    jobs: 5,
    income: 80,
    expense: 15
  },

  office: {
    name: "Office",
    icon: "🏢",
    cost: 5000,
    population: 0,
    jobs: 15,
    income: 180,
    expense: 30
  },

  factory: {
    name: "Factory",
    icon: "🏭",
    cost: 8000,
    population: 0,
    jobs: 25,
    income: 300,
    expense: 70
  },

  park: {
    name: "Park",
    icon: "🌳",
    cost: 1500,
    population: 0,
    jobs: 0,
    income: 0,
    expense: 8
  }

};


/* =========================================================
   GAME STATE
========================================================= */

let game = {

  money: 50000,

  day: 1,

  hour: 8,

  minute: 0,

  happiness: 100,

  paused: false,

  selected: "road",

  city: Array(TOTAL_TILES).fill(null)

};


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const cityMap = document.getElementById("cityMap");

const moneyEl = document.getElementById("money");
const populationEl = document.getElementById("population");
const happinessEl = document.getElementById("happiness");
const cityDayEl = document.getElementById("cityDay");

const homesEl = document.getElementById("homes");
const jobsEl = document.getElementById("jobs");
const shopsEl = document.getElementById("shops");
const factoriesEl = document.getElementById("factories");
const parksEl = document.getElementById("parks");

const cityLevelEl = document.getElementById("cityLevel");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const ratingEl = document.getElementById("rating");

const clockEl = document.getElementById("clock");
const statusEl = document.getElementById("status");
const messageEl = document.getElementById("message");

const pauseBtn = document.getElementById("pauseBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");

const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");

const notification = document.getElementById("notification");


/* =========================================================
   CREATE CITY MAP
========================================================= */

function createMap() {

  cityMap.innerHTML = "";

  for (let index = 0; index < TOTAL_TILES; index++) {

    const tile = document.createElement("div");

    tile.className = "tile";

    tile.dataset.index = index;

    tile.title = "Empty land";

    tile.addEventListener("click", function () {

      buildAt(index);

    });

    cityMap.appendChild(tile);

  }

  renderCity();

}


/* =========================================================
   RENDER CITY
========================================================= */

function renderCity() {

  const tiles = cityMap.querySelectorAll(".tile");

  tiles.forEach(function (tile, index) {

    tile.className = "tile";

    tile.innerHTML = "";

    const building = game.city[index];

    if (!building) {

      tile.title = "Empty land";

      return;

    }

    tile.classList.add(building.type);

    const buildingData = BUILDINGS[building.type];

    const icon = document.createElement("span");

    icon.className = "building-icon";

    icon.textContent = buildingData.icon;

    tile.appendChild(icon);

    tile.title =
      buildingData.name +
      " — Cost $" +
      buildingData.cost.toLocaleString();

  });

  updateStats();

}


/* =========================================================
   BUILD ON TILE
========================================================= */

function buildAt(index) {

  const selected = game.selected;


  /* BULDOZE MODE */

  if (selected === "bulldoze") {

    bulldoze(index);

    return;

  }


  /* CHECK BUILDING */

  if (!BUILDINGS[selected]) {

    return;

  }


  /* CHECK OCCUPIED */

  if (game.city[index]) {

    showNotification(
      "⚠️ This land is already occupied."
    );

    return;

  }


  const building = BUILDINGS[selected];


  /* CHECK MONEY */

  if (game.money < building.cost) {

    showNotification(
      "💰 You don't have enough money."
    );

    return;

  }


  /* PAY */

  game.money -= building.cost;


  /* CREATE BUILDING */

  game.city[index] = {

    type: selected

  };


  renderCity();


  showNotification(
    building.icon +
    " " +
    building.name +
    " built for $" +
    building.cost.toLocaleString()
  );

}


/* =========================================================
   BULLDOZE
========================================================= */

function bulldoze(index) {

  const building = game.city[index];


  if (!building) {

    showNotification(
      "Nothing is built on this tile."
    );

    return;

  }


  const data = BUILDINGS[building.type];


  /* 50% REFUND */

  const refund =
    Math.floor(data.cost * 0.5);


  game.money += refund;


  game.city[index] = null;


  renderCity();


  showNotification(
    "🗑️ " +
    data.name +
    " removed. Refund: $" +
    refund.toLocaleString()
  );

}


/* =========================================================
   BUILD MENU
========================================================= */

const buildButtons =
  document.querySelectorAll(".build-btn");


buildButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    buildButtons.forEach(function (btn) {

      btn.classList.remove("active");

    });


    button.classList.add("active");


    game.selected =
      button.dataset.type;


    if (game.selected === "bulldoze") {

      messageEl.textContent =
        "🗑️ Bulldozer selected. Click a building to remove it.";

      return;

    }


    const data =
      BUILDINGS[game.selected];


    messageEl.textContent =
      data.icon +
      " " +
      data.name +
      " selected. Click an empty tile to build.";

  });

});


/* =========================================================
   CITY SYSTEM BUTTONS
========================================================= */

const featureButtons =
  document.querySelectorAll(".feature-btn");


featureButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    const feature =
      button.dataset.feature;

    openFeature(feature);

  });

});


function openFeature(feature) {

  const names = {

    traffic: "🚦 Traffic",

    citizens: "👨‍👩‍👧 Citizens",

    economy: "💰 Economy",

    electricity: "⚡ Electricity",

    water: "💧 Water",

    waste: "🗑️ Waste",

    police: "🚓 Police",

    fire: "🚒 Fire",

    hospital: "🏥 Hospital",

    education: "🎓 Education",

    transport: "🚌 Transport",

    weather: "🌦️ Weather"

  };


  const name =
    names[feature] || feature;


  showNotification(
    name +
    " system will be added in a future feature."
  );

}


/* =========================================================
   CALCULATE CITY STATISTICS
========================================================= */

function calculateStats() {

  let population = 0;

  let jobs = 0;

  let income = 0;

  let expenses = 0;

  let homes = 0;

  let shops = 0;

  let factories = 0;

  let parks = 0;

  let roads = 0;


  game.city.forEach(function (building) {

    if (!building) return;


    const data =
      BUILDINGS[building.type];


    population +=
      data.population;


    jobs +=
      data.jobs;


    income +=
      data.income;


    expenses +=
      data.expense;


    if (building.type === "house") {

      homes++;

    }


    if (building.type === "shop") {

      shops++;

    }


    if (building.type === "factory") {

      factories++;

    }


    if (building.type === "park") {

      parks++;

    }


    if (building.type === "road") {

      roads++;

    }

  });


  return {

    population,
    jobs,
    income,
    expenses,
    homes,
    shops,
    factories,
    parks,
    roads

  };

}


/* =========================================================
   HAPPINESS
========================================================= */

function calculateHappiness(stats) {

  let score = 70;


  /* PARKS */

  if (stats.parks > 0) {

    score +=
      Math.min(stats.parks * 3, 15);

  }


  /* JOBS */

  if (stats.population > 0) {

    if (
      stats.jobs >=
      stats.population * 0.5
    ) {

      score += 5;

    } else {

      score -= 10;

    }

  }


  /* ROADS */

  const requiredRoads =
    Math.max(
      1,
      Math.ceil(stats.population / 10)
    );


  if (
    stats.roads <
    requiredRoads
  ) {

    score -= 8;

  }


  /* FACTORY POLLUTION */

  if (stats.factories >= 5) {

    score -= 5;

  }


  /* LIMIT */

  score =
    Math.max(
      0,
      Math.min(100, score)
    );


  return Math.round(score);

}


/* =========================================================
   CITY LEVEL
========================================================= */

function getCityLevel(population) {

  if (population >= 1000) {

    return "Metropolis";

  }

  if (population >= 500) {

    return "Large City";

  }

  if (population >= 200) {

    return "City";

  }

  if (population >= 50) {

    return "Town";

  }

  return "Village";

}


/* =========================================================
   UPDATE ALL STATISTICS
========================================================= */

function updateStats() {

  const stats =
    calculateStats();


  game.happiness =
    calculateHappiness(stats);


  moneyEl.textContent =
    "$" +
    Math.floor(game.money)
      .toLocaleString();


  populationEl.textContent =
    stats.population.toLocaleString();


  happinessEl.textContent =
    game.happiness +
    "%";


  cityDayEl.textContent =
    "Day " +
    game.day;


  homesEl.textContent =
    stats.homes;


  jobsEl.textContent =
    stats.jobs;


  shopsEl.textContent =
    stats.shops;


  factoriesEl.textContent =
    stats.factories;


  parksEl.textContent =
    stats.parks;


  cityLevelEl.textContent =
    getCityLevel(stats.population);


  incomeEl.textContent =
    "$" +
    stats.income.toLocaleString();


  expensesEl.textContent =
    "$" +
    stats.expenses.toLocaleString();


  const rating =
    Math.max(
      0,
      Math.min(
        5,
        game.happiness / 20
      )
    );


  ratingEl.textContent =
    rating.toFixed(1);

}


/* =========================================================
   CITY CLOCK
========================================================= */

function updateClock() {

  if (game.paused) {

    return;

  }


  game.minute += 10;


  if (game.minute >= 60) {

    game.minute = 0;

    game.hour++;

  }


  if (game.hour >= 24) {

    game.hour = 0;

    game.day++;

    processDailyEconomy();

  }


  clockEl.textContent =
    String(game.hour)
      .padStart(2, "0") +
    ":" +
    String(game.minute)
      .padStart(2, "0");


  cityDayEl.textContent =
    "Day " +
    game.day;

}


/* =========================================================
   DAILY ECONOMY
========================================================= */

function processDailyEconomy() {

  const stats =
    calculateStats();


  const profit =
    stats.income -
    stats.expenses;


  game.money += profit;


  if (profit > 0) {

    showNotification(
      "📈 Daily profit: $" +
      profit.toLocaleString()
    );

  } else if (profit < 0) {

    showNotification(
      "📉 Daily loss: $" +
      Math.abs(profit)
        .toLocaleString()
    );

  } else {

    showNotification(
      "📊 Daily balance: $0"
    );

  }


  updateStats();

}


/* =========================================================
   PAUSE / RESUME
========================================================= */

pauseBtn.addEventListener("click", function () {

  game.paused =
    !game.paused;


  updatePauseUI();


  if (game.paused) {

    messageEl.textContent =
      "⏸ The city simulation is paused.";

  } else {

    messageEl.textContent =
      "▶ The city simulation is running.";

  }

});


function updatePauseUI() {

  if (game.paused) {

    pauseBtn.textContent =
      "▶ Resume";

    statusEl.textContent =
      "CITY PAUSED";

    statusEl.style.color =
      "#facc15";

  } else {

    pauseBtn.textContent =
      "⏸ Pause";

    statusEl.textContent =
      "CITY RUNNING";

    statusEl.style.color =
      "#4ade80";

  }

}


/* =========================================================
   SAVE CITY
========================================================= */

saveBtn.addEventListener("click", function () {

  try {

    localStorage.setItem(
      "cityManagerSimulatorSave",
      JSON.stringify(game)
    );


    showNotification(
      "💾 City saved successfully."
    );

  } catch (error) {

    console.error(error);

    showNotification(
      "❌ Could not save the city."
    );

  }

});


/* =========================================================
   LOAD CITY
========================================================= */

loadBtn.addEventListener("click", function () {

  const saved =
    localStorage.getItem(
      "cityManagerSimulatorSave"
    );


  if (!saved) {

    showNotification(
      "ℹ️ No saved city was found."
    );

    return;

  }


  try {

    const loaded =
      JSON.parse(saved);


    if (
      !loaded.city ||
      !Array.isArray(loaded.city)
    ) {

      throw new Error(
        "Invalid save data."
      );

    }


    game = loaded;


    renderCity();

    updatePauseUI();


    showNotification(
      "↩️ City loaded successfully."
    );

  } catch (error) {

    console.error(error);

    showNotification(
      "❌ The saved city could not be loaded."
    );

  }

});


/* =========================================================
   CLEAR CITY
========================================================= */

clearBtn.addEventListener("click", function () {

  const confirmed =
    confirm(
      "Remove all buildings from the city?"
    );


  if (!confirmed) {

    return;

  }


  game.city =
    Array(TOTAL_TILES)
      .fill(null);


  renderCity();


  showNotification(
    "🗑️ All buildings removed."
  );

});


/* =========================================================
   NEW CITY
========================================================= */

resetBtn.addEventListener("click", function () {

  const confirmed =
    confirm(
      "Start a completely new city?"
    );


  if (!confirmed) {

    return;

  }


  game = {

    money: 50000,

    day: 1,

    hour: 8,

    minute: 0,

    happiness: 100,

    paused: false,

    selected: "road",

    city:
      Array(TOTAL_TILES)
        .fill(null)

  };


  buildButtons.forEach(function (button) {

    button.classList.remove("active");

  });


  const roadButton =
    document.querySelector(
      '[data-type="road"]'
    );


  if (roadButton) {

    roadButton.classList.add(
      "active"
    );

  }


  renderCity();

  updatePauseUI();


  messageEl.textContent =
    "Select a building and click the map to build.";


  showNotification(
    "🏙️ New city created!"
  );

});


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimer;


function showNotification(text) {

  notification.textContent =
    text;


  notification.classList.add(
    "show"
  );


  clearTimeout(
    notificationTimer
  );


  notificationTimer =
    setTimeout(function () {

      notification.classList.remove(
        "show"
      );

    }, 2500);

}


/* =========================================================
   SIMULATION TIMER
========================================================= */

setInterval(function () {

  updateClock();

}, 1000);


/* =========================================================
   INITIALIZE GAME
========================================================= */

createMap();

updateStats();

updatePauseUI();


console.log(
  "City Manager Simulator loaded successfully."
);
```
