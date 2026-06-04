import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Calculator,
  Check,
  Circle,
  Clock3,
  CloudSun,
  Copy,
  Dice5,
  ExternalLink,
  Gamepad2,
  KeyRound,
  Layers,
  LocateFixed,
  Lock,
  Map,
  Music,
  Pause,
  Palette,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Target,
  Timer,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import heroArt from "./assets/hero.png";
import "./App.css";

const themes = {
  command: { name: "Command", className: "theme-command" },
  light: { name: "Light Desk", className: "theme-light" },
  night: { name: "Night Ops", className: "theme-night" },
};

const toolCatalog = [
  {
    id: "calculator",
    name: "Calculator",
    icon: Calculator,
    tag: "Math",
    detail: "Fast arithmetic with recent results.",
    status: "Ready",
    size: "medium",
  },
  {
    id: "notes",
    name: "Notes & Tasks",
    icon: StickyNote,
    tag: "Planning",
    detail: "Persistent notes and a clean task queue.",
    status: "Saved locally",
    size: "large",
  },
  {
    id: "timer",
    name: "Focus Timer",
    icon: Timer,
    tag: "Focus",
    detail: "Pomodoro style timer with presets.",
    status: "25 min",
    size: "medium",
  },
  {
    id: "weather",
    name: "Weather Planner",
    icon: CloudSun,
    tag: "Day plan",
    detail: "Plan around conditions and gear.",
    status: "Offline mode",
    size: "wide",
  },
  {
    id: "qr",
    name: "QR Studio",
    icon: QrCode,
    tag: "Share",
    detail: "Make a sharp QR-style code card.",
    status: "Exportable",
    size: "medium",
  },
  {
    id: "password",
    name: "Password Forge",
    icon: Lock,
    tag: "Security",
    detail: "Generate strong local passwords.",
    status: "Local only",
    size: "medium",
  },
  {
    id: "map",
    name: "Map Hub",
    icon: Map,
    tag: "Navigation",
    detail: "Quick launch common map searches.",
    status: "Links",
    size: "wide",
  },
  {
    id: "music",
    name: "Music Launcher",
    icon: Music,
    tag: "Audio",
    detail: "Jump into playlists and focus modes.",
    status: "4 modes",
    size: "medium",
  },
  {
    id: "game",
    name: "2248 Board",
    icon: Gamepad2,
    tag: "Break",
    detail: "A tiny merge puzzle for resets.",
    status: "Playable",
    size: "large",
  },
];

const initialTasks = [
  { id: "review", text: "Review today priorities", done: false },
  { id: "ship", text: "Ship the command center polish", done: true },
];

const storageKeys = {
  calcHistory: "command-center-calc-history",
  note: "command-center-note",
  tasks: "command-center-tasks",
};

const legacyStorageKeys = {
  calcHistory: "nexakit-calc-history",
  note: "nexakit-note",
  tasks: "nexakit-tasks",
};

const storage = {
  get(key, fallback, legacyKey) {
    try {
      const item = localStorage.getItem(key) ?? (legacyKey ? localStorage.getItem(legacyKey) : null);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function safeEvaluate(expression) {
  const normalized = expression.replace(/x/g, "*").replace(/%/g, "/100");
  if (!normalized.trim()) return "0";
  if (!/^[\d+\-*/().\s%]+$/.test(normalized)) return "Error";

  try {
    const value = Function(`"use strict"; return (${normalized})`)();
    if (!Number.isFinite(value)) return "Error";
    return Number(value.toFixed(8)).toLocaleString();
  } catch {
    return "Error";
  }
}

function CalculatorTool() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState(() => storage.get(storageKeys.calcHistory, [], legacyStorageKeys.calcHistory));
  const keys = ["AC", "DEL", "%", "/", "7", "8", "9", "x", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

  const press = (key) => {
    if (key === "AC") {
      setExpression("");
      setResult("0");
      return;
    }

    if (key === "DEL") {
      const next = expression.slice(0, -1);
      setExpression(next);
      setResult(safeEvaluate(next));
      return;
    }

    if (key === "=") {
      const finalResult = safeEvaluate(expression);
      if (expression && finalResult !== "Error") {
        const nextHistory = [{ expression, result: finalResult }, ...history].slice(0, 5);
        setHistory(nextHistory);
        storage.set(storageKeys.calcHistory, nextHistory);
        setExpression(finalResult.replace(/,/g, ""));
      }
      setResult(finalResult);
      return;
    }

    const operators = ["+", "-", "x", "/", "%"];
    const last = expression.slice(-1);
    const next = operators.includes(key) && operators.includes(last) ? expression.slice(0, -1) + key : expression + key;
    setExpression(next);
    setResult(safeEvaluate(next));
  };

  return (
    <div className="calculator-tool tool-surface-grid">
      <section className="calc-device">
        <div className="calc-display">
          <span>Smart Calculator</span>
          <p>{expression || "0"}</p>
          <strong>{result}</strong>
        </div>

        <div className="calc-pad">
          {keys.map((key) => (
            <button
              key={key}
              className={`calc-key ${["/", "x", "-", "+", "="].includes(key) ? "operator" : ""} ${key === "=" ? "equals" : ""}`}
              onClick={() => press(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      <section className="side-list">
        <p className="section-kicker">Recent</p>
        {history.length === 0 ? (
          <div className="empty-row">No calculations yet</div>
        ) : (
          history.map((item, index) => (
            <button className="history-row" key={`${item.expression}-${index}`} onClick={() => setExpression(item.result.replace(/,/g, ""))}>
              <span>{item.expression}</span>
              <strong>{item.result}</strong>
            </button>
          ))
        )}
      </section>
    </div>
  );
}

function NotesTasksTool() {
  const [note, setNote] = useState(() => localStorage.getItem(storageKeys.note) ?? localStorage.getItem(legacyStorageKeys.note) ?? "Capture ideas, meetings, and reminders here.");
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState(() => storage.get(storageKeys.tasks, initialTasks, legacyStorageKeys.tasks));

  const saveNote = (next) => {
    setNote(next);
    localStorage.setItem(storageKeys.note, next);
  };

  const saveTasks = (next) => {
    setTasks(next);
    storage.set(storageKeys.tasks, next);
  };

  const addTask = () => {
    const text = taskText.trim();
    if (!text) return;
    saveTasks([{ id: crypto.randomUUID(), text, done: false }, ...tasks]);
    setTaskText("");
  };

  return (
    <div className="notes-tool">
      <section className="note-editor">
        <p className="section-kicker">Quick Note</p>
        <textarea value={note} onChange={(event) => saveNote(event.target.value)} />
      </section>

      <section className="task-editor">
        <p className="section-kicker">Tasks</p>
        <div className="input-action">
          <input
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addTask()}
            placeholder="Add a task"
          />
          <button className="icon-button filled" onClick={addTask} aria-label="Add task">
            <Plus size={18} />
          </button>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <div className={`task-row ${task.done ? "done" : ""}`} key={task.id}>
              <button className="check-button" onClick={() => saveTasks(tasks.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)))} aria-label="Toggle task">
                {task.done ? <Check size={16} /> : <Circle size={16} />}
              </button>
              <span>{task.text}</span>
              <button className="icon-button subtle" onClick={() => saveTasks(tasks.filter((item) => item.id !== task.id))} aria-label="Delete task">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TimerTool() {
  const presets = [15, 25, 45, 60];
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          setRunning(false);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const display = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const progress = 1 - secondsLeft / (minutes * 60);

  const setPreset = (preset) => {
    setMinutes(preset);
    setSecondsLeft(preset * 60);
    setRunning(false);
  };

  return (
    <div className="timer-tool">
      <section className="timer-dial" style={{ "--progress": `${Math.max(0, progress) * 360}deg` }}>
        <span>Focus Timer</span>
        <strong>{display}</strong>
        <p>{running ? "In progress" : "Ready"}</p>
      </section>

      <section className="timer-controls">
        <p className="section-kicker">Preset</p>
        <div className="segmented">
          {presets.map((preset) => (
            <button className={minutes === preset ? "active" : ""} onClick={() => setPreset(preset)} key={preset}>
              {preset}m
            </button>
          ))}
        </div>

        <div className="timer-buttons">
          <button className="command-button" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? "Pause" : "Start"}
          </button>
          <button className="command-button secondary" onClick={() => setPreset(minutes)}>
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </section>
    </div>
  );
}

function WeatherTool() {
  const [location, setLocation] = useState("Paris");
  const [condition, setCondition] = useState("Clear");
  const [temperature, setTemperature] = useState(22);
  const conditionData = {
    Clear: { icon: CloudSun, note: "Light layers and sunglasses." },
    Wind: { icon: Activity, note: "Secure loose gear and plan slower travel." },
    Rain: { icon: CloudSun, note: "Carry waterproof layers and buffer transit." },
    Cold: { icon: ShieldCheck, note: "Pack thermal layers and warm drinks." },
  };
  const Icon = conditionData[condition].icon;

  return (
    <div className="weather-tool">
      <section className="forecast-card">
        <Icon size={42} />
        <div>
          <p className="section-kicker">{location}</p>
          <strong>{temperature}C</strong>
          <span>{conditionData[condition].note}</span>
        </div>
      </section>

      <section className="planner-controls">
        <label>
          <span>Location</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <label>
          <span>Temperature</span>
          <input type="range" min="-10" max="40" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
        </label>
        <div className="segmented wrap">
          {Object.keys(conditionData).map((item) => (
            <button className={condition === item ? "active" : ""} onClick={() => setCondition(item)} key={item}>
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function pseudoQrCells(value) {
  const text = value || "Command Center";
  const cells = [];
  for (let row = 0; row < 21; row += 1) {
    for (let col = 0; col < 21; col += 1) {
      const finder =
        (row < 7 && col < 7) ||
        (row < 7 && col > 13) ||
        (row > 13 && col < 7);
      const finderInner =
        (row > 1 && row < 5 && col > 1 && col < 5) ||
        (row > 1 && row < 5 && col > 15 && col < 19) ||
        (row > 15 && row < 19 && col > 1 && col < 5);
      const char = text.charCodeAt((row * 7 + col) % text.length);
      const active = finder ? (finderInner || row === 0 || col === 0 || row === 6 || col === 6 || col === 14 || row === 14 || row === 20 || col === 20) : (char + row * 13 + col * 7) % 5 < 2;
      cells.push({ row, col, active });
    }
  }
  return cells;
}

function generatePasswordValue(length, includeSymbols) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*?";
  const pool = letters + numbers + (includeSymbols ? symbols : "");
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => pool[value % pool.length]).join("");
}

function QrTool() {
  const [value, setValue] = useState("https://command-center.local");
  const cells = useMemo(() => pseudoQrCells(value), [value]);

  const copyValue = async () => {
    await navigator.clipboard?.writeText(value);
  };

  return (
    <div className="qr-tool">
      <section className="qr-preview" aria-label="QR preview">
        {cells.map((cell) => (
          <span className={cell.active ? "active" : ""} key={`${cell.row}-${cell.col}`} />
        ))}
      </section>

      <section className="qr-controls">
        <p className="section-kicker">Payload</p>
        <textarea value={value} onChange={(event) => setValue(event.target.value)} />
        <button className="command-button" onClick={copyValue}>
          <Copy size={18} />
          Copy text
        </button>
      </section>
    </div>
  );
}

function PasswordTool() {
  const [length, setLength] = useState(18);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState(() => generatePasswordValue(18, true));

  const generate = () => {
    setPassword(generatePasswordValue(length, includeSymbols));
  };

  return (
    <div className="password-tool">
      <section className="password-output">
        <KeyRound size={34} />
        <strong>{password}</strong>
        <button className="command-button" onClick={() => navigator.clipboard?.writeText(password)}>
          <Copy size={18} />
          Copy
        </button>
      </section>

      <section className="password-controls">
        <label>
          <span>Length</span>
          <input type="range" min="10" max="32" value={length} onChange={(event) => setLength(Number(event.target.value))} />
          <strong>{length}</strong>
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={includeSymbols} onChange={(event) => setIncludeSymbols(event.target.checked)} />
          <span>Symbols</span>
        </label>
        <button className="command-button" onClick={generate}>
          <Dice5 size={18} />
          Generate
        </button>
      </section>
    </div>
  );
}

function MapTool() {
  const [query, setQuery] = useState("coffee near me");
  const links = [
    { label: "Google Maps", url: `https://www.google.com/maps/search/${encodeURIComponent(query)}` },
    { label: "OpenStreetMap", url: `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}` },
    { label: "Bing Maps", url: `https://www.bing.com/maps?q=${encodeURIComponent(query)}` },
  ];

  return (
    <div className="map-tool">
      <section className="map-console">
        <LocateFixed size={36} />
        <p className="section-kicker">Search</p>
        <div className="input-action">
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
          <Search size={18} />
        </div>
      </section>

      <section className="link-list">
        {links.map((link) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.label}>
            <span>{link.label}</span>
            <ExternalLink size={18} />
          </a>
        ))}
      </section>
    </div>
  );
}

function MusicTool() {
  const modes = [
    { label: "Deep Work", icon: Target, url: "https://open.spotify.com/search/deep%20focus" },
    { label: "Ambient", icon: Layers, url: "https://open.spotify.com/search/ambient%20focus" },
    { label: "Energy", icon: Zap, url: "https://open.spotify.com/search/productive%20beats" },
    { label: "Lo-fi", icon: Music, url: "https://open.spotify.com/search/lofi%20study" },
  ];

  return (
    <div className="music-tool">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <a className="mode-card" href={mode.url} target="_blank" rel="noreferrer" key={mode.label}>
            <Icon size={28} />
            <span>{mode.label}</span>
            <ArrowUpRight size={18} />
          </a>
        );
      })}
    </div>
  );
}

function makeGameBoard() {
  const values = [2, 2, 4, 8, 16];
  return Array.from({ length: 16 }, () => values[Math.floor(Math.random() * values.length)]);
}

function GameTool() {
  const [board, setBoard] = useState(makeGameBoard);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const playCell = (index) => {
    if (selected === null) {
      setSelected(index);
      return;
    }

    const adjacent = Math.abs(selected - index) === 1 || Math.abs(selected - index) === 4;
    if (adjacent && board[selected] === board[index]) {
      const next = [...board];
      next[index] *= 2;
      next[selected] = 2;
      setBoard(next);
      setScore(score + next[index]);
    }
    setSelected(null);
  };

  return (
    <div className="game-tool">
      <section className="score-strip">
        <span>Score</span>
        <strong>{score}</strong>
        <button className="icon-button filled" onClick={() => { setBoard(makeGameBoard()); setScore(0); setSelected(null); }} aria-label="New board">
          <RefreshCw size={18} />
        </button>
      </section>
      <section className="game-board">
        {board.map((value, index) => (
          <button className={`tile tile-${Math.min(value, 64)} ${selected === index ? "selected" : ""}`} onClick={() => playCell(index)} key={`${value}-${index}`}>
            {value}
          </button>
        ))}
      </section>
    </div>
  );
}

function ToolPanel({ tool, onClose }) {
  const panels = {
    calculator: <CalculatorTool />,
    notes: <NotesTasksTool />,
    timer: <TimerTool />,
    weather: <WeatherTool />,
    qr: <QrTool />,
    password: <PasswordTool />,
    map: <MapTool />,
    music: <MusicTool />,
    game: <GameTool />,
  };
  const Icon = tool.icon;

  return (
    <motion.section className="panel-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}>
      <motion.div className="tool-panel" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} onClick={(event) => event.stopPropagation()}>
        <header className="panel-header">
          <div className="panel-title">
            <span className="tool-mark">
              <Icon size={22} />
            </span>
            <div>
              <p className="section-kicker">{tool.tag}</p>
              <h2>{tool.name}</h2>
            </div>
          </div>
          <button className="icon-button subtle" onClick={onClose} aria-label="Close panel">
            <X size={20} />
          </button>
        </header>
        {panels[tool.id]}
      </motion.div>
    </motion.section>
  );
}

export default function App() {
  const [theme, setTheme] = useState("command");
  const [activeToolId, setActiveToolId] = useState(null);
  const activeTool = toolCatalog.find((tool) => tool.id === activeToolId);
  const completeCount = toolCatalog.filter((tool) => tool.status !== "Offline mode").length;

  return (
    <main className={`app ${themes[theme].className}`}>
      <aside className="sidebar" aria-label="Tool navigation">
        <div className="brand-mark">
          <Sparkles size={22} />
        </div>
        <div className="sidebar-icons">
          {toolCatalog.slice(0, 6).map((tool) => {
            const Icon = tool.icon;
            return (
              <button className={`side-button ${activeToolId === tool.id ? "active" : ""}`} onClick={() => setActiveToolId(tool.id)} key={tool.id} aria-label={tool.name}>
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </aside>

      <div className="workspace">
        <nav className="topbar">
          <div>
            <p className="section-kicker">Personal Command Center</p>
            <h1>Command Center</h1>
          </div>

          <label className="theme-switcher">
            <Palette size={18} />
            <select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label="Theme">
              {Object.entries(themes).map(([key, value]) => (
                <option value={key} key={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </label>
        </nav>

        <section className="overview">
          <motion.article className="command-hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hero-copy">
              <p className="section-kicker">Today Workspace</p>
              <h2>Tools, notes, timing, sharing, security, and quick launches in one clean board.</h2>
              <div className="hero-actions">
                <button className="command-button" onClick={() => setActiveToolId("notes")}>
                  <StickyNote size={18} />
                  Open tasks
                </button>
                <button className="command-button secondary" onClick={() => setActiveToolId("timer")}>
                  <Clock3 size={18} />
                  Start focus
                </button>
              </div>
            </div>
            <img src={heroArt} alt="" />
          </motion.article>

          <motion.article className="status-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="status-icon">
              <Activity size={26} />
            </div>
            <p className="section-kicker">System</p>
            <strong>{completeCount}/9</strong>
            <span>tools active</span>
            <div className="meter">
              <i style={{ width: `${(completeCount / toolCatalog.length) * 100}%` }} />
            </div>
          </motion.article>
        </section>

        <section className="tool-grid">
          {toolCatalog.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.button
                className={`tool-card ${tool.size}`}
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
              >
                <span className="tool-card-top">
                  <span className="tool-mark">
                    <Icon size={22} />
                  </span>
                  <span className="tool-status">{tool.status}</span>
                </span>
                <span className="tool-copy">
                  <span>{tool.tag}</span>
                  <strong>{tool.name}</strong>
                  <em>{tool.detail}</em>
                </span>
              </motion.button>
            );
          })}
        </section>
      </div>

      {activeTool && <ToolPanel tool={activeTool} onClose={() => setActiveToolId(null)} />}
    </main>
  );
}
