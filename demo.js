(function () {
  "use strict";

  var KEY = "terralearna.demoUser";

  var sections = [
    { id: "countries", label: "Countries", say: "Tap any country to learn about it. Egypt is the example.", example: "egypt" },
    { id: "continents", label: "Continents", say: "A continent gets a gold outline. Africa is the example.", example: "africa" },
    { id: "nature", label: "Nature", say: "Nature paints the land by what it is. The Sahara is the example.", example: "sahara" },
    { id: "equator", label: "Equator", say: "The equator is a gold line. Egypt is in the northern half.", example: "equator" },
    { id: "inside", label: "Inside", say: "The Earth opens. The crust is the thin rocky skin we live on.", example: "crust" },
    { id: "atmosphere", label: "Atmosphere", say: "The air right around us is the troposphere. Weather lives here.", example: "air" },
    { id: "sun", label: "Sun & Moon", say: "The Sun lights one side of the Earth. Spin it to go from day to night.", example: "sun" },
    { id: "seasons", label: "Seasons", say: "The Earth leans. The half leaning towards the Sun has summer.", example: "year" },
    { id: "oceans", label: "Oceans", say: "Oceans shades the water by how deep it is, and names the seas.", example: "sea" },
    { id: "sealife", label: "Sea Life", say: "Tap a sea animal. Some are on a long trip.", example: "whale" },
    { id: "lessons", label: "Lessons", say: "Tut says he would start with Welcome to Egypt. Ages 8 to 11.", example: "lesson" },
    { id: "signup", label: "Sign up", say: "Make a demo explorer. It stays in this browser. Nothing is sent.", example: null }
  ];

  var examples = {
    egypt: ["Egypt", "Capital Cairo. Camels, crocodiles and scarab beetles. The Great Pyramids are over 4,500 years old."],
    africa: ["Africa", "The whole continent gets one gold outline. Its countries are listed biggest land first."],
    sahara: ["The Sahara", "Nature mode names deserts, forests, mountains and ice. This desert is one you can tap."],
    equator: ["Equator", "A gold line around the middle. Egypt sits in the northern half."],
    crust: ["The Crust", "The thin rocky skin we live on. If Earth were an apple, the crust would be thinner than the peel."],
    air: ["The Troposphere", "The air right around us. Clouds, rain, snow and wind all happen here."],
    sun: ["Sun & Moon", "The Sun lights one side of the Earth. The other side is night."],
    year: ["September", "The Earth leans. The half leaning towards the Sun has summer. Play a year to watch it change."],
    sea: ["Oceans", "The water is shaded by how deep it is. Tap a sea to learn its name."],
    whale: ["Humpback whale", "Humpback dads sing long songs that can go on for hours. This one travels about 9,000 km."],
    lesson: ["Welcome to Egypt", "Tut the mummy. Six short modules, for ages 8 to 11. Welcome to Egypt is 10 steps."]
  };

  var model = document.getElementById("model");
  var card = document.getElementById("card");
  var say = document.getElementById("play-say");
  var who = document.getElementById("who");
  var form = document.getElementById("signup-form");
  var nav = document.getElementById("sections");
  var index = 0;
  var paused = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadUser() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveUser(user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  function paintWho() {
    var user = loadUser();
    if (!user || !user.name) {
      who.hidden = true;
      who.textContent = "";
      return;
    }
    who.hidden = false;
    who.textContent = "Demo explorer: " + user.name;
  }

  function showCard(exampleId, tapped) {
    form.hidden = true;
    card.hidden = false;
    var row = examples[exampleId];
    var lead = tapped ? "You tapped it. " : "";
    card.innerHTML = "<h2>" + row[0] + "</h2><p>" + lead + row[1] + "</p>";
  }

  function showSignup() {
    card.hidden = true;
    form.hidden = false;
    var user = loadUser();
    var welcome = document.getElementById("welcome");
    var fields = document.getElementById("signup-fields");
    if (user && user.name) {
      fields.hidden = true;
      welcome.hidden = false;
      welcome.querySelector("strong").textContent = user.name;
    } else {
      fields.hidden = false;
      welcome.hidden = true;
    }
  }

  function go(i, fromUser) {
    if (fromUser) paused = true;
    index = (i + sections.length) % sections.length;
    var section = sections[index];
    model.dataset.section = section.id;
    say.textContent = section.say;
    var buttons = nav.querySelectorAll("button");
    for (var n = 0; n < buttons.length; n++) {
      buttons[n].setAttribute("aria-current", buttons[n].dataset.index === String(index) ? "true" : "false");
    }
    var hotSpec = hotLabels[section.id];
    if (hotSpec) {
      hot.textContent = hotSpec[0];
      hot.setAttribute("data-example", hotSpec[1]);
    }
    if (section.id === "signup") {
      paused = true;
      showSignup();
    } else {
      showCard(section.example, false);
    }
  }

  sections.forEach(function (section, i) {
    var item = document.createElement("li");
    var button = document.createElement("button");
    button.type = "button";
    button.dataset.index = String(i);
    button.textContent = section.label;
    button.addEventListener("click", function () { go(i, true); });
    item.appendChild(button);
    nav.appendChild(item);
  });

  var hot = document.querySelector(".pin.egypt");
  var hotLabels = {
    countries: ["Egypt", "egypt"],
    continents: ["Africa", "africa"],
    nature: ["Sahara", "sahara"],
    equator: ["Equator", "equator"],
    oceans: ["A sea", "sea"]
  };

  model.addEventListener("click", function (event) {
    var pin = event.target.closest("[data-example]");
    if (!pin) return;
    paused = true;
    showCard(pin.getAttribute("data-example"), true);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = document.getElementById("demo-name");
    var name = input.value.trim().slice(0, 24);
    if (!name) {
      input.focus();
      return;
    }
    saveUser({ name: name });
    paintWho();
    showSignup();
    say.textContent = "Hi " + name + ". Your demo explorer is ready. It stays in this browser.";
  });

  document.getElementById("forget").addEventListener("click", function () {
    localStorage.removeItem(KEY);
    document.getElementById("demo-name").value = "";
    paintWho();
    showSignup();
    say.textContent = sections[index].say;
  });

  model.addEventListener("pointerdown", function () { paused = true; });

  paintWho();
  go(0, false);
  if (!reduce) {
    window.setInterval(function () {
      if (!paused) go(index + 1, false);
    }, 6800);
  }
})();
