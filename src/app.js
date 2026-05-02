const BOOT_DURATION_MS = 60000;
const DEV_FAST_BOOT = new URLSearchParams(window.location.search).has("fast");

const bootSteps = [
  "Preparing complete beginner path",
  "Opening Explorer and Properties panels",
  "Loading Luau lessons",
  "Building GUI practice missions",
  "Wiring RemoteEvent lab",
  "Syncing animation marker timeline",
  "Training RPG, farming, shop, and inventory systems",
  "Starting Luax AI Mentor",
  "Polishing the Studio simulator"
];

const lessons = [
  {
    id: "studio-first-look",
    track: "Studio Basics",
    title: "What Roblox Studio is",
    difficulty: "Noob",
    badge: "Beginner",
    summary: "Learn the four panels you will stare at every day: Viewport, Explorer, Properties, and Output.",
    copy: "Roblox Studio is where you build the world, place objects, add scripts, test gameplay, and debug what breaks. Your first power move is knowing where everything lives.",
    xp: 40,
    mode: "studio",
    answer: 1,
    options: [
      "Properties stores every player's save data automatically.",
      "Explorer shows the objects in your game, while Properties edits the selected object.",
      "Output is only used for changing colors."
    ],
    code: {
      client: "-- First tiny client experiment\nprint(\"Luax loaded for this player\")",
      server: "-- First tiny server experiment\nprint(\"Server is running the game\")",
      module: "local StudioBasics = {}\nStudioBasics.Goal = \"Know where objects and settings live\"\nreturn StudioBasics"
    },
    tree: ["Workspace", "Players", "Lighting", "ReplicatedStorage", "StarterGui", "ServerScriptService"],
    props: { Name: "Baseplate", Anchored: "true", Material: "Plastic", Parent: "Workspace" }
  },
  {
    id: "lua-variables-functions",
    track: "Luau Basics",
    title: "Variables, functions, and prints",
    difficulty: "Noob",
    badge: "Beginner",
    summary: "Write the first code patterns every Roblox game uses.",
    copy: "A variable remembers a value. A function bundles actions. A print tells Output what happened so you can debug without guessing.",
    xp: 50,
    mode: "script",
    answer: 0,
    options: [
      "A function lets you reuse the same behavior whenever you call it.",
      "A variable can only store a Part.",
      "print deletes code after it runs."
    ],
    code: {
      client: "local playerName = \"Builder\"\n\nlocal function greet(name)\n    print(\"Welcome, \" .. name)\nend\n\ngreet(playerName)",
      server: "local coins = 0\ncoins += 10\nprint(\"Coins:\", coins)",
      module: "local MathPractice = {}\nfunction MathPractice.AddCoins(current, amount)\n    return current + amount\nend\nreturn MathPractice"
    },
    tree: ["StarterPlayer", "StarterPlayerScripts", "LocalScript", "Output"],
    props: { ScriptType: "LocalScript", RunsOn: "Client", Skill: "Debugging" }
  },
  {
    id: "parts-events",
    track: "World Interactions",
    title: "Parts, touched events, and signals",
    difficulty: "Rookie",
    badge: "Builder",
    summary: "Make the world react when a player touches something.",
    copy: "Events are Roblox saying something happened. You connect code to the event, then run your reaction at the right moment.",
    xp: 65,
    mode: "part",
    answer: 2,
    options: [
      "Touched only works inside LocalScripts in StarterGui.",
      "Events are folders that store images.",
      "Touched:Connect runs your function when another part touches this part."
    ],
    code: {
      client: "-- Client can play quick effects when told by the server",
      server: "local pad = workspace.SpeedPad\n\npad.Touched:Connect(function(hit)\n    local character = hit.Parent\n    local humanoid = character:FindFirstChildOfClass(\"Humanoid\")\n    if humanoid then\n        humanoid.WalkSpeed = 24\n    end\nend)",
      module: "local Pads = {}\nfunction Pads.Boost(humanoid)\n    humanoid.WalkSpeed = 24\nend\nreturn Pads"
    },
    tree: ["Workspace", "SpeedPad", "Script", "Humanoid"],
    props: { Name: "SpeedPad", CanCollide: "true", Event: "Touched" }
  },
  {
    id: "gui-buttons",
    track: "GUI",
    title: "GUI buttons that feel alive",
    difficulty: "Rookie",
    badge: "UI Builder",
    summary: "Build ScreenGui, frames, buttons, hover states, and click actions.",
    copy: "GUI usually starts in StarterGui. Use LocalScripts for visual behavior like hover and click feedback, then ask the server before changing important data.",
    xp: 75,
    mode: "gui",
    answer: 1,
    options: [
      "ServerScriptService is where buttons must be drawn.",
      "A LocalScript should handle button clicks and visual feedback for the player.",
      "ScreenGui should be placed in Workspace."
    ],
    code: {
      client: "local button = script.Parent\n\nbutton.MouseEnter:Connect(function()\n    button.BackgroundTransparency = 0.1\nend)\n\nbutton.Activated:Connect(function()\n    print(\"Clicked shop button\")\nend)",
      server: "-- Server handles the real purchase after a remote request.",
      module: "local GuiTheme = {\n    Primary = Color3.fromRGB(98, 245, 168),\n    Danger = Color3.fromRGB(255, 107, 107)\n}\nreturn GuiTheme"
    },
    tree: ["StarterGui", "ShopGui", "Frame", "BuyButton", "LocalScript"],
    props: { Name: "BuyButton", Text: "Buy", AutoButtonColor: "true", Parent: "ShopGui" }
  },
  {
    id: "module-scripts",
    track: "Clean Code",
    title: "ModuleScripts link your systems",
    difficulty: "Apprentice",
    badge: "Coder",
    summary: "Stop copying code everywhere and start building services.",
    copy: "ModuleScripts return a table of functions and data. That table can be required from many scripts, which is how bigger games stay organized.",
    xp: 90,
    mode: "module",
    answer: 0,
    options: [
      "Use require(ModuleScript) to load reusable functions and data.",
      "ModuleScripts only run inside the Viewport.",
      "ModuleScripts are for storing images."
    ],
    code: {
      client: "local Remotes = game.ReplicatedStorage.Remotes\nRemotes.EquipSword:FireServer(\"IronSword\")",
      server: "local Inventory = require(game.ServerScriptService.Systems.Inventory)\n\nRemotes.EquipSword.OnServerEvent:Connect(function(player, itemId)\n    Inventory.Equip(player, itemId)\nend)",
      module: "local Inventory = {}\n\nfunction Inventory.Equip(player, itemId)\n    print(player.Name, \"equipped\", itemId)\nend\n\nreturn Inventory"
    },
    tree: ["ServerScriptService", "Systems", "Inventory", "Combat", "QuestService"],
    props: { Name: "Inventory", Type: "ModuleScript", Pattern: "Service" }
  },
  {
    id: "remote-events",
    track: "RemoteEvents",
    title: "Client to server safely",
    difficulty: "Apprentice",
    badge: "Networker",
    summary: "Learn the exact bridge between GUI/input and real server gameplay.",
    copy: "RemoteEvents let clients request actions from the server. The key is that the server decides what is real. Clients can ask, servers verify.",
    xp: 110,
    mode: "remote",
    answer: 2,
    options: [
      "Trust the client because exploiters cannot edit LocalScripts.",
      "Put all combat damage in a LocalScript.",
      "Use RemoteEvents for requests, then validate the request on the server."
    ],
    code: {
      client: "local Remotes = game.ReplicatedStorage.Remotes\n\nscript.Parent.Activated:Connect(function()\n    Remotes.SwingSword:FireServer()\nend)",
      server: "Remotes.SwingSword.OnServerEvent:Connect(function(player)\n    if not Combat.CanSwing(player) then return end\n    Combat.Swing(player)\nend)",
      module: "local Combat = {}\nfunction Combat.CanSwing(player)\n    return true -- check cooldown, state, weapon, range\nend\nreturn Combat"
    },
    tree: ["ReplicatedStorage", "Remotes", "SwingSword", "ServerScriptService", "CombatService"],
    props: { Name: "SwingSword", ClassName: "RemoteEvent", Rule: "Server validates" }
  },
  {
    id: "animation-events",
    track: "Animation",
    title: "Animation markers trigger gameplay",
    difficulty: "Skilled",
    badge: "Animator",
    summary: "Connect hit frames, sounds, VFX, cooldowns, and UI to animation timing.",
    copy: "Pro combat feels good because the code waits for exact animation markers. A marker can trigger a hitbox, sound, particle burst, or camera shake.",
    xp: 130,
    mode: "animation",
    answer: 1,
    options: [
      "Animation markers are only decorations.",
      "GetMarkerReachedSignal can run code at a named moment in an animation.",
      "Animations can only be controlled by Workspace."
    ],
    code: {
      client: "local track = animator:LoadAnimation(slashAnimation)\n\ntrack:GetMarkerReachedSignal(\"HitFrame\"):Connect(function()\n    Remotes.Attack:FireServer(comboIndex)\nend)\n\ntrack:Play()",
      server: "Remotes.Attack.OnServerEvent:Connect(function(player, comboIndex)\n    Combat.TryHit(player, comboIndex)\nend)",
      module: "local ComboData = {\n    [1] = { Damage = 8, Range = 7 },\n    [2] = { Damage = 11, Range = 8 }\n}\nreturn ComboData"
    },
    tree: ["StarterCharacterScripts", "Animator", "SlashAnimation", "HitFrame Marker", "Attack Remote"],
    props: { Marker: "HitFrame", Frame: "0.32s", LinksTo: "Combat.TryHit" }
  },
  {
    id: "datastores",
    track: "Saving",
    title: "DataStores and leaderstats",
    difficulty: "Skilled",
    badge: "Systems",
    summary: "Save coins, levels, seeds, inventory, quests, and progression.",
    copy: "Saving is server-owned. Load data when players join, keep a profile in memory, update it through safe services, then save when they leave.",
    xp: 140,
    mode: "save",
    answer: 0,
    options: [
      "The server should own saving and loading player data.",
      "LocalScripts are the safest place to save currency.",
      "DataStores automatically save every variable without code."
    ],
    code: {
      client: "-- Client reads UI updates sent from the server.",
      server: "Players.PlayerAdded:Connect(function(player)\n    DataService.Load(player)\n    Leaderstats.Create(player)\nend)\n\nPlayers.PlayerRemoving:Connect(function(player)\n    DataService.Save(player)\nend)",
      module: "local DataService = {}\nfunction DataService.AddCoins(player, amount)\n    local profile = DataService.Profiles[player]\n    profile.Coins += amount\nend\nreturn DataService"
    },
    tree: ["ServerScriptService", "DataService", "Leaderstats", "Player Profile", "DataStore"],
    props: { Owner: "Server", Saves: "Coins, XP, Items", Risk: "Throttle limits" }
  },
  {
    id: "rpg-systems",
    track: "Pro Game Systems",
    title: "RPG combat like a serious game",
    difficulty: "Pro",
    badge: "Game Maker",
    summary: "Map the pieces behind RPG combat, enemy AI, quests, stats, and abilities.",
    copy: "A deep RPG is not one giant script. It is many focused systems: CombatService, AbilityService, StateService, InventoryService, QuestService, EnemyAI, UI, audio, VFX, and saving.",
    xp: 180,
    mode: "rpg",
    answer: 2,
    options: [
      "Put the entire RPG in one Script so it is easy to find.",
      "Let clients decide damage because it feels faster.",
      "Split systems into services and validate important actions on the server."
    ],
    code: {
      client: "InputService.InputBegan:Connect(function(input, typing)\n    if typing then return end\n    if input.KeyCode == Enum.KeyCode.E then\n        Remotes.CastAbility:FireServer(\"DashStrike\")\n    end\nend)",
      server: "Remotes.CastAbility.OnServerEvent:Connect(function(player, abilityId)\n    AbilityService.Cast(player, abilityId)\nend)",
      module: "function AbilityService.Cast(player, abilityId)\n    local ability = AbilityData[abilityId]\n    if not State.CanAct(player) then return end\n    if not Cooldowns.Ready(player, abilityId) then return end\n    ability.Run(player)\nend"
    },
    tree: ["ServerScriptService", "CombatService", "AbilityService", "StateService", "EnemyAI", "QuestService"],
    props: { Pattern: "Service modules", Combat: "Validated", Polish: "Animations + VFX + UI" }
  },
  {
    id: "simulator-farming",
    track: "Pro Game Systems",
    title: "Farming, collection, and shop loops",
    difficulty: "Pro",
    badge: "Game Maker",
    summary: "Build loops like plant, grow, harvest, sell, upgrade, unlock.",
    copy: "Games like farming and collection sims work because the loop is clear: action, reward, upgrade, unlock, repeat. The server owns rewards, the client makes it feel great.",
    xp: 180,
    mode: "farm",
    answer: 1,
    options: [
      "The client should award rare items because it can animate faster.",
      "The server should calculate rewards, while the client shows satisfying effects.",
      "Shops do not need validation."
    ],
    code: {
      client: "plot.HarvestPrompt.Triggered:Connect(function()\n    Remotes.HarvestPlot:FireServer(plotId)\nend)",
      server: "Remotes.HarvestPlot.OnServerEvent:Connect(function(player, plotId)\n    if FarmService.CanHarvest(player, plotId) then\n        FarmService.Harvest(player, plotId)\n    end\nend)",
      module: "local Crops = {\n    Carrot = { GrowTime = 60, Reward = 12 },\n    CrystalMelon = { GrowTime = 900, Reward = 450 }\n}\nreturn Crops"
    },
    tree: ["Workspace", "Plots", "ReplicatedStorage.Remotes", "FarmService", "ShopService", "DataService"],
    props: { Loop: "Plant -> Grow -> Harvest", ServerOwns: "Rewards", ClientOwns: "Effects" }
  }
];

let state = {
  currentLesson: 0,
  activeCodeTab: "client",
  completed: {},
  xp: 0,
  streak: 0
};

const savedState = localStorage.getItem("luax-state");
if (savedState) {
  try {
    state = { ...state, ...JSON.parse(savedState) };
  } catch (_error) {
    localStorage.removeItem("luax-state");
  }
}

const splash = document.querySelector("#splash");
const appShell = document.querySelector("#app");
const bootBar = document.querySelector("#bootBar");
const bootPercent = document.querySelector("#bootPercent");
const bootStep = document.querySelector("#bootStep");
const bootLabel = document.querySelector("#bootLabel");

function boot() {
  const duration = DEV_FAST_BOOT ? 1400 : BOOT_DURATION_MS;
  const started = performance.now();

  function tick(now) {
    const progress = Math.min((now - started) / duration, 1);
    const percent = Math.floor(progress * 100);
    const stepIndex = Math.min(Math.floor(progress * bootSteps.length), bootSteps.length - 1);
    bootBar.style.width = `${percent}%`;
    bootPercent.textContent = `${percent}%`;
    bootStep.textContent = bootSteps[stepIndex];
    bootLabel.textContent = progress > 0.88 ? "Finalizing Luax" : "Loading Luax";

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      splash.classList.add("done");
      appShell.classList.remove("shell-hidden");
      renderAll();
      greetAssistant();
    }
  }

  requestAnimationFrame(tick);
}

function saveState() {
  localStorage.setItem("luax-state", JSON.stringify(state));
}

function getCompletedCount() {
  return Object.values(state.completed).filter(Boolean).length;
}

function getRank() {
  if (state.xp >= 900) return "Pro Game Maker";
  if (state.xp >= 520) return "Systems Builder";
  if (state.xp >= 260) return "Luau Coder";
  if (state.xp >= 100) return "Rookie Builder";
  return "Noob Builder";
}

function renderAll() {
  renderStats();
  renderCourseMap();
  renderLesson();
  renderLab();
}

function renderStats() {
  const completed = getCompletedCount();
  const progress = Math.round((completed / lessons.length) * 100);
  document.querySelector("#navProgress").textContent = `${progress}%`;
  document.querySelector("#xpText").textContent = `${state.xp} XP earned`;
  document.querySelector("#streakText").textContent = String(state.streak);
  document.querySelector("#lessonCount").textContent = `${completed}/${lessons.length}`;
  document.querySelector("#rankText").textContent = getRank();
  document.querySelector("#levelText").textContent = String(Math.max(1, Math.floor(state.xp / 180) + 1));
}

function renderCourseMap() {
  const map = document.querySelector("#courseMap");
  map.innerHTML = "";

  lessons.forEach((lesson, index) => {
    const card = document.createElement("button");
    card.className = "course-card";
    if (index === state.currentLesson) card.classList.add("active");
    if (state.completed[lesson.id]) card.classList.add("done");
    card.innerHTML = `
      <strong>${escapeHtml(lesson.title)}</strong>
      <span>${escapeHtml(lesson.summary)}</span>
      <div class="card-meta">
        <span>${escapeHtml(lesson.track)}</span>
        <span>${state.completed[lesson.id] ? "Done" : `${lesson.xp} XP`}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      state.currentLesson = index;
      state.activeCodeTab = "client";
      saveState();
      renderAll();
    });
    map.appendChild(card);
  });
}

function renderLesson() {
  const lesson = lessons[state.currentLesson];
  document.querySelector("#courseBadge").textContent = lesson.badge;
  document.querySelector("#lessonTrack").textContent = lesson.track;
  document.querySelector("#lessonTitle").textContent = lesson.title;
  document.querySelector("#lessonDifficulty").textContent = lesson.difficulty;
  document.querySelector("#lessonCopy").textContent = lesson.copy;
  document.querySelector("#studioMode").textContent = visualModeTitle(lesson.mode);
  document.querySelector("#codeBlock code").textContent = lesson.code[state.activeCodeTab];

  document.querySelectorAll("[data-code-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.codeTab === state.activeCodeTab);
  });

  renderExplorer(document.querySelector("#explorerTree"), lesson.tree);
  renderProperties(document.querySelector("#propertiesList"), lesson.props);
  renderChallenge(lesson);
  updateVisualMode(lesson.mode);
}

function renderChallenge(lesson) {
  const area = document.querySelector("#challengeArea");
  area.innerHTML = "";

  const question = document.createElement("p");
  question.textContent = "Quick check";
  question.className = "eyebrow";
  area.appendChild(question);

  lesson.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = option;
    button.addEventListener("click", () => {
      area.querySelectorAll(".answer-button").forEach((item) => {
        item.classList.remove("correct", "wrong");
      });
      button.classList.add(index === lesson.answer ? "correct" : "wrong");
      if (index === lesson.answer) {
        runVisual(lesson.mode);
      }
    });
    area.appendChild(button);
  });
}

function renderExplorer(container, items) {
  container.innerHTML = "";
  items.forEach((item, index) => {
    const node = document.createElement("span");
    node.className = `tree-item ${index === items.length - 1 ? "active" : ""}`;
    node.textContent = `${"  ".repeat(Math.min(index, 3))}${index > 0 ? "- " : ""}${item}`;
    container.appendChild(node);
  });
}

function renderProperties(container, props) {
  container.innerHTML = "";
  Object.entries(props).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.innerHTML = `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`;
    container.appendChild(row);
  });
}

function visualModeTitle(mode) {
  const titles = {
    studio: "Studio View",
    script: "Script Output",
    part: "World Event",
    gui: "GUI Builder",
    module: "Module Linking",
    remote: "Remote Bridge",
    animation: "Animation Marker",
    save: "Data Saving",
    rpg: "RPG Systems",
    farm: "Farming Loop"
  };
  return titles[mode] || "Studio View";
}

function updateVisualMode(mode) {
  document.querySelector("#avatar").classList.toggle("active", ["animation", "rpg"].includes(mode));
  document.querySelector("#worldObject").classList.toggle("active", ["part", "farm", "rpg"].includes(mode));
  document.querySelector("#signalBeam").classList.toggle("active", ["remote", "animation", "gui", "module"].includes(mode));
  document.querySelector("#effectBurst").classList.toggle("active", ["animation", "rpg", "farm", "save"].includes(mode));
}

function runVisual(mode) {
  updateVisualMode(mode);
  const burst = document.querySelector("#effectBurst");
  const beam = document.querySelector("#signalBeam");
  burst.classList.remove("active");
  beam.classList.remove("active");
  requestAnimationFrame(() => {
    burst.classList.add("active");
    beam.classList.add("active");
  });
}

function completeLesson() {
  const lesson = lessons[state.currentLesson];
  if (!state.completed[lesson.id]) {
    state.completed[lesson.id] = true;
    state.xp += lesson.xp;
    state.streak += 1;
  }
  if (state.currentLesson < lessons.length - 1) {
    state.currentLesson += 1;
  }
  state.activeCodeTab = "client";
  saveState();
  renderAll();
}

function renderLab() {
  renderExplorer(document.querySelector("#labExplorer"), [
    "Workspace",
    "TrainingMap",
    "PracticeDummy",
    "ReplicatedStorage",
    "Remotes",
    "ServerScriptService",
    "Systems",
    "StarterGui"
  ]);
  renderProperties(document.querySelector("#labProperties"), {
    Focus: "Current tool",
    Result: "Watch viewport",
    Rule: "Client asks, server validates"
  });

  const log = document.querySelector("#labLog");
  if (!log.dataset.ready) {
    log.dataset.ready = "true";
    addLabLog("Tap a tool to see how Studio objects, scripts, remotes, and animations connect.");
  }
}

function addLabLog(text) {
  const log = document.querySelector("#labLog");
  const row = document.createElement("div");
  row.className = "log-row";
  row.textContent = text;
  log.prepend(row);
  while (log.children.length > 5) {
    log.removeChild(log.lastChild);
  }
}

async function askMentor(prompt) {
  const chat = document.querySelector("#chatLog");
  appendMessage("user", "You", prompt);
  appendMessage("assistant", "Luax Mentor", "Thinking through the Studio model...");

  const last = chat.lastElementChild;
  const lesson = lessons[state.currentLesson];
  const payload = {
    prompt,
    context: `${lesson.track}: ${lesson.title}. ${lesson.copy}`
  };

  let response;
  try {
    if (window.luax?.askAssistant) {
      response = await window.luax.askAssistant(payload);
    } else {
      response = fallbackMentor(prompt);
    }
  } catch (_error) {
    response = fallbackMentor(prompt);
  }

  document.querySelector("#assistantMode").textContent = response.mode === "python" ? "Python" : "Local";
  last.innerHTML = formatMentorResponse(response);
}

function fallbackMentor(prompt) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("remote")) {
    return {
      mode: "renderer",
      title: "RemoteEvent bridge",
      answer: "Client code should request actions. Server code should validate and apply real changes.",
      steps: ["LocalScript fires remote.", "Server checks player state.", "Server changes data or gameplay."],
      code: "Remote.OnServerEvent:Connect(function(player)\n    -- validate first\nend)"
    };
  }
  return {
    mode: "renderer",
    title: "Luax Mentor",
    answer: "Break the build into tiny systems, test each one, then connect them through ModuleScripts and RemoteEvents.",
    steps: ["Build one mechanic.", "Move important logic to the server.", "Use visual feedback on the client."],
    code: ""
  };
}

function appendMessage(type, title, text) {
  const chat = document.querySelector("#chatLog");
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = `<strong>${escapeHtml(title)}</strong>${escapeHtml(text)}`;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function formatMentorResponse(response) {
  const steps = Array.isArray(response.steps) && response.steps.length
    ? `<ol>${response.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`
    : "";
  const code = response.code
    ? `<pre><code>${escapeHtml(response.code)}</code></pre>`
    : "";
  return `<strong>${escapeHtml(response.title || "Luax Mentor")}</strong>${escapeHtml(response.answer || "")}${steps}${code}`;
}

function greetAssistant() {
  const chat = document.querySelector("#chatLog");
  if (chat.children.length) return;
  appendMessage("assistant", "Luax Mentor", "Ask me what to build next, why your script is not linking, or how GUI, RemoteEvents, animation markers, and server systems connect.");
}

function showView(view) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.remove("active-view");
  });
  document.querySelector(`#view${view[0].toUpperCase()}${view.slice(1)}`).classList.add("active-view");

  const titles = {
    learn: "From complete noob to Roblox pro",
    studio: "Visual Roblox Studio simulator",
    remotes: "RemoteEvents and animation links",
    assistant: "Ask the Luax AI Mentor"
  };
  document.querySelector("#viewTitle").textContent = titles[view];
}

function playRemoteFlow() {
  const lab = document.querySelector(".remote-lab");
  const nodes = Array.from(document.querySelectorAll(".flow-node"));
  lab.classList.add("playing");
  nodes.forEach((node) => node.classList.remove("active"));
  nodes.forEach((node, index) => {
    setTimeout(() => node.classList.add("active"), index * 650);
    setTimeout(() => node.classList.remove("active"), index * 650 + 1050);
  });
  setTimeout(() => lab.classList.remove("playing"), 3600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

document.querySelectorAll("[data-code-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.activeCodeTab = button.dataset.codeTab;
    saveState();
    renderLesson();
  });
});

document.querySelector("#runLesson").addEventListener("click", () => {
  runVisual(lessons[state.currentLesson].mode);
});

document.querySelector("#completeLesson").addEventListener("click", completeLesson);

document.querySelector("#resetProgress").addEventListener("click", () => {
  state = { currentLesson: 0, activeCodeTab: "client", completed: {}, xp: 0, streak: 0 };
  saveState();
  renderAll();
});

document.querySelectorAll(".tool-grid button").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const messages = {
      part: "Placed a Part in Workspace. This is a physical object players can see or touch.",
      script: "Added a Script in ServerScriptService. Server code controls real game state.",
      gui: "Created StarterGui.ShopGui. LocalScripts make buttons feel instant.",
      remote: "Created ReplicatedStorage.Remotes.TrainSkill. Clients can request, servers decide.",
      animate: "Played an AnimationTrack and fired a HitFrame marker.",
      save: "Sent reward to DataService. The server owns saving."
    };
    addLabLog(messages[action]);
    runVisual(action);
  });
});

document.querySelector("#playRemoteFlow").addEventListener("click", playRemoteFlow);

document.querySelector("#assistantForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#assistantInput");
  const prompt = input.value.trim();
  if (!prompt) return;
  input.value = "";
  askMentor(prompt);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    showView("assistant");
    askMentor(button.dataset.prompt);
  });
});

boot();
