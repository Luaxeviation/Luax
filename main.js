const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = process.argv.includes("--dev");

function createWindow() {
  const window = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1040,
    minHeight: 720,
    backgroundColor: "#07110f",
    show: false,
    title: "Luax",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.once("ready-to-show", () => {
    window.show();
    if (isDev) {
      window.webContents.openDevTools({ mode: "detach" });
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  const rendererPath = path.join(__dirname, "src", "index.html");
  if (isDev) {
    window.loadFile(rendererPath, { query: { fast: "1" } });
  } else {
    window.loadFile(rendererPath);
  }
}

app.whenReady().then(() => {
  ipcMain.handle("assistant:ask", async (_event, payload) => {
    return askAssistant(payload);
  });

  ipcMain.handle("app:meta", () => ({
    version: app.getVersion(),
    packaged: app.isPackaged
  }));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function askAssistant(payload) {
  const prompt = String(payload?.prompt || "").trim();
  const context = String(payload?.context || "").trim();

  if (!prompt) {
    return {
      mode: "local-js",
      title: "Ask me anything Roblox Studio",
      answer: "Tell me what you are building or what is confusing you. I can explain Studio, Luau, GUI, RemoteEvents, animation events, RPG systems, farming loops, inventory, tools, and client/server safety.",
      steps: []
    };
  }

  const pythonResult = await tryPythonAssistant(prompt, context);
  if (pythonResult) {
    return pythonResult;
  }

  return localAssistant(prompt, context);
}

function tryPythonAssistant(prompt, context) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, "assistant", "luax_assistant.py");
    const candidates = [
      process.env.LUAX_PYTHON,
      process.platform === "win32" ? "py" : null,
      "python3",
      "python"
    ].filter(Boolean);

    let index = 0;

    function next() {
      if (index >= candidates.length) {
        resolve(null);
        return;
      }

      const command = candidates[index++];
      const args = command === "py"
        ? ["-3", scriptPath]
        : [scriptPath];

      const child = spawn(command, args, {
        stdio: ["pipe", "pipe", "ignore"],
        windowsHide: true
      });

      let stdout = "";
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          child.kill();
          next();
        }
      }, 1800);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString("utf8");
      });

      child.on("error", () => {
        clearTimeout(timer);
        if (!settled) {
          settled = true;
          next();
        }
      });

      child.on("close", () => {
        clearTimeout(timer);
        if (settled) {
          return;
        }
        settled = true;
        try {
          resolve(JSON.parse(stdout));
        } catch (_error) {
          next();
        }
      });

      child.stdin.write(JSON.stringify({ prompt, context }));
      child.stdin.end();
    }

    next();
  });
}

function localAssistant(prompt, context) {
  const normalized = `${prompt} ${context}`.toLowerCase();

  if (normalized.includes("remote") || normalized.includes("client") || normalized.includes("server")) {
    return {
      mode: "local-js",
      title: "RemoteEvents without the confusion",
      answer: "Think of a RemoteEvent as a bridge between the player's device and the server. The client asks, the server checks if it is allowed, then the server changes the real game state.",
      steps: [
        "Create ReplicatedStorage.Remotes.UseSkill.",
        "LocalScript fires UseSkill:FireServer(skillId, targetId).",
        "ServerScript listens with OnServerEvent(player, skillId, targetId).",
        "Validate cooldowns, distance, ownership, and data on the server.",
        "Broadcast visuals with another RemoteEvent only after the server accepts it."
      ],
      code: "UseSkill.OnServerEvent:Connect(function(player, skillId, targetId)\n    if not CanUseSkill(player, skillId, targetId) then return end\n    CombatService.Cast(player, skillId, targetId)\nend)"
    };
  }

  if (normalized.includes("animation") || normalized.includes("anim")) {
    return {
      mode: "local-js",
      title: "Link animation to gameplay",
      answer: "Use animation markers to make hits, sounds, particles, and cooldowns happen on exact frames. The animation plays, a marker fires, then your combat or tool system reacts.",
      steps: [
        "Create an AnimationTrack on the Animator.",
        "Add markers like HitFrame and EndLag in Roblox's Animation Editor.",
        "Connect track:GetMarkerReachedSignal(\"HitFrame\").",
        "At the marker, call the server or run server-owned hit detection.",
        "Stop input until EndLag so the move feels fair."
      ],
      code: "track:GetMarkerReachedSignal(\"HitFrame\"):Connect(function()\n    Remotes.Attack:FireServer(comboIndex)\nend)"
    };
  }

  if (normalized.includes("gui") || normalized.includes("button") || normalized.includes("screen")) {
    return {
      mode: "local-js",
      title: "GUI path",
      answer: "Roblox UI starts in StarterGui. Put a ScreenGui there, add frames and buttons, then use LocalScripts for button clicks and server RemoteEvents for anything that changes data.",
      steps: [
        "Build the visual frame in StarterGui.",
        "Use constraints so it scales on every screen.",
        "Put LocalScripts inside the UI for hover and click behavior.",
        "Never give currency, XP, items, or damage directly from a LocalScript.",
        "Ask the server through a RemoteEvent when real game state changes."
      ],
      code: "button.Activated:Connect(function()\n    Remotes.BuySeed:FireServer(\"Carrot\")\nend)"
    };
  }

  if (normalized.includes("rpg") || normalized.includes("deepwoken") || normalized.includes("combat")) {
    return {
      mode: "local-js",
      title: "RPG systems map",
      answer: "A pro RPG is built from small linked systems: input, movement, combat validation, stats, inventory, quests, enemy AI, saving, UI, and polish.",
      steps: [
        "Start with a CombatService on the server.",
        "Keep player stats in one profile module.",
        "Make abilities data-driven with tables.",
        "Use remotes for requests, never for trust.",
        "Connect animations, hitboxes, sounds, VFX, cooldowns, and UI feedback."
      ],
      code: "local Ability = Abilities[skillId]\nif Ability and Cooldowns.Ready(player, skillId) then\n    Ability.Cast(player, target)\nend"
    };
  }

  return {
    mode: "local-js",
    title: "Luax Mentor",
    answer: "Start tiny, then link one new concept at a time. In Roblox, the big jump is learning what runs on the client, what runs on the server, and how ModuleScripts keep your systems clean.",
    steps: [
      "Learn Studio panels: Explorer, Properties, Viewport, Output.",
      "Learn Luau basics: variables, functions, tables, loops.",
      "Build a GUI button that prints and animates.",
      "Move real game changes to server scripts.",
      "Use ModuleScripts for reusable systems.",
      "Use RemoteEvents to connect UI, tools, combat, farming, and quests."
    ],
    code: "local Lesson = {}\nfunction Lesson.Start(player)\n    print(player.Name .. \" is learning Luax\")\nend\nreturn Lesson"
  };
}
