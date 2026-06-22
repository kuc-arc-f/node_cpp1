const blessed = require('blessed');

// 1. Screen Initialization
const screen = blessed.screen({
  smartCSR: true,
  title: 'App TUI Chat Assistant',
  dockBorders: true
});

// Define color themes
const THEME = {
  bg: '#0f172a',          // Slate 900
  borderActive: '#10b981', // Emerald 500 (active)
  borderInactive: '#334155', // Slate 700 (inactive)
  headerBg: '#1e293b',    // Slate 800
  headerFg: '#38bdf8',    // Sky 400
  chatUser: '#818cf8',    // Indigo 400
  chatAi: '#34d399',      // Emerald 400
  chatSystem: '#94a3b8',  // Slate 400
  codeBg: '#1e1e2e',      // Dark Mocha style for code
  footerBg: '#020617',    // Slate 950
  footerFg: '#64748b'     // Slate 500
};

// 2. Main Layout Components

// Header Bar
//content: ' ⚡ {bold}AppName TUI ASSISTANT{/bold} | Interactive AI Pair Programming Terminal',
const header = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  content: ' ⚡ {bold}AppName TUI ASSISTANT{/bold} | Terminal example',
  tags: true,
  style: {
    bg: THEME.headerBg,
    fg: THEME.headerFg,
    border: {
      type: 'line',
      fg: THEME.borderInactive
    }
  }
});

// Chat Log Container (Left side)
const chatContainer = blessed.box({
  parent: screen,
  top: 3,
  left: 0,
  width: '100%',
  height: '100%-4',
  style: {
    bg: THEME.bg
  }
});

// Chat History Log
const chatLog = blessed.log({
  parent: chatContainer,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%-6',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: '#1e293b'
    },
    style: {
      bg: THEME.borderActive
    }
  },
  border: {
    type: 'line',
    fg: THEME.borderInactive
  },
  label: ' Chat History (Ctrl+L to clear, Scroll with Mouse/Vi keys) '
});

// Input Border and Area
const inputBorder = blessed.box({
  parent: chatContainer,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 6,
  border: {
    type: 'line',
    fg: THEME.borderInactive
  },
  label: ' Write a prompt... (Press Enter to Send, Shift+Enter for newline) '
});

const inputField = blessed.textarea({
  parent: inputBorder,
  top: 0,
  left: 1,
  right: 1,
  height: 4,
  inputOnFocus: true,
  keys: true,
  mouse: true,
  style: {
    fg: '#f8fafc',
    bg: THEME.bg
  }
});


// Footer / Status Bar
const footer = blessed.box({
  parent: screen,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 1,
  content: ' [Enter] Send  |  [Tab] Switch focus  |  [Ctrl+L] Clear Chat  | [Esc] [Ctrl+C] Exit TUI ',
  style: {
    bg: THEME.footerBg,
    fg: THEME.footerFg
  }
});

// 3. Focus Management Logic
let activeElement = inputField;

function setFocus(elem) {
  activeElement = elem;
  
  // Update borders to show active state
  if (elem === inputField) {
    inputBorder.style.border.fg = THEME.borderActive;
    //codeContainer.style.border.fg = THEME.borderInactive;
  }
  
  elem.focus();
  screen.render();
}

// Toggle focus with Tab
screen.key(['tab'], () => {
  if (activeElement === inputField) {
    //setFocus(codeViewer);
  } else {
    setFocus(inputField);
  }
});

// Clear Chat Log with Ctrl+L
screen.key(['C-l'], () => {
  chatLog.setContent('');
  chatLog.log('{yellow-fg}* Chat log cleared *{/yellow-fg}');
  screen.render();
});

// Quit with Ctrl+C
screen.key(['C-c'], () => {
  return process.exit(0);
});

// Handle initial focus
setFocus(inputField);

// 4. Chat Interaction and Prompt Logic

// Add initial greeting to chat log
chatLog.log(`{cyan-fg}[System]{/cyan-fg} Welcome to TUI Chat!`);
//chatLog.log(`{cyan-fg}[System]{/cyan-fg} Try asking for "{bold}quicksort{/bold}", "{bold}react component{/bold}", or "{bold}python api{/bold}".`);
chatLog.log(`--------------------------------------------------------------------------------`);

// Listen to textarea keypresses to capture Enter key for sending
inputField.on('keypress', (ch, key) => {
  // Check if Enter was pressed without Shift
  if (key && key.name === 'enter' && !key.shift) {
    const text = inputField.getValue();
    
    // Use timeout to prevent the default newline insertion in textarea
    setTimeout(() => {
      inputField.clearValue();
      const prompt = text.trim();
      if (prompt) {
        handleUserPrompt(prompt);
      }
      screen.render();
    }, 10);
  }
});

function handleUserPrompt(prompt) {
  // 1. Log User message
  chatLog.log(`\n{bold}{indigo-fg}User:{/indigo-fg}{/bold} ${prompt}`);
  chatLog.scroll(100); // Auto-scroll to bottom
  screen.render();

  // 2. Show thinking indicator
  chatLog.log(`{italic}{yellow-fg}App is writing code...{/yellow-fg}{/italic}`);
  screen.render();

  // 3. Process AI Response (simulated delay for realism)
  setTimeout(() => {
    // Delete the "thinking" line by re-rendering without it (since log appends, we just push the real content)
    // In blessed.log, we can't easily pop the last line, so we just append the output.
    
    const response = generateAIResponse(prompt);
    
    chatLog.log(`\n{bold}{emerald-fg}App AI:{/emerald-fg}{/bold} ${response.message}`);
    
    if (response.code) {
      // Print formatted code snippet in the chat log (limited preview)
      chatLog.log(`{yellow-fg}[Code updated in Workspace Pane]{/yellow-fg}`);
      
      // Update the right-side workspace panel with full code
      //codeViewer.setContent(response.code);
    }
    
    chatLog.scroll(100);
    screen.render();
  }, 1000);
}

// AI response and code generators depending on user input
function generateAIResponse(prompt) {
  const query = prompt.toLowerCase();
  
  if (query.includes('quicksort') || query.includes('quick sort')) {
    return {
      message: "Here is a complete implementation of Quicksort in JavaScript. I have loaded the code into your Workspace.",
      code: getQuicksortCode()
    };
  }
  
  if (query.includes('react') || query.includes('component')) {
    return {
      message: "I've created a modern React functional component featuring dark mode and interactive states. View the code in the Workspace pane.",
      code: getReactComponentCode()
    };
  }
  
  if (query.includes('python') || query.includes('api') || query.includes('flask')) {
    return {
      message: "Here is a clean REST API server example using Python and Flask, complete with endpoints and error handling. Check the workspace.",
      code: getPythonApiCode()
    };
  }

  if (query.includes('clear')) {
    // Hidden command shortcut
    setTimeout(() => {
      chatLog.setContent('');
      chatLog.log('{yellow-fg}* Chat log cleared *{/yellow-fg}');
      screen.render();
    }, 50);
    return {
      message: "Clearing the chat screen for you.",
      code: null
    };
  }

  // Default response
  return {
    message: `I understood your prompt: "${prompt}". Here is a template helper function generated for this request.`,
    code: getGenericCode(prompt)
  };
}

// 5. Code Templates Helper Functions

function getPlaceholderCode() {
  return `{gray-fg}// Welcome to Codex Workspace!
// Generated code snippets will appear here.
// Use Tab to switch focus to this pane and scroll.

function greet() {
  console.log("Ready to pair program!");
}

greet();
{/gray-fg}`;
}

function getQuicksortCode() {
  return `{magenta-fg}/**
 * Quicksort Implementation in JavaScript
 * Time Complexity: O(n log n) average
 */{/magenta-fg}
{blue-fg}function{/blue-fg} {green-fg}quickSort{/green-fg}(arr) {
  {blue-fg}if{/blue-fg} (arr.length <= 1) {
    {blue-fg}return{/blue-fg} arr;
  }

  {blue-fg}const{/blue-fg} pivot = arr[arr.length - 1];
  {blue-fg}const{/blue-fg} left = [];
  {blue-fg}const{/blue-fg} right = [];

  {blue-fg}for{/blue-fg} ({blue-fg}let{/blue-fg} i = 0; i < arr.length - 1; i++) {
    {blue-fg}if{/blue-fg} (arr[i] < pivot) {
      left.push(arr[i]);
    } {blue-fg}else{/blue-fg} {
      right.push(arr[i]);
    }
  }

  {blue-fg}return{/blue-fg} [...{green-fg}quickSort{/green-fg}(left), pivot, ...{green-fg}quickSort{/green-fg}(right)];
}

{gray-fg}// Example Usage:{/gray-fg}
{blue-fg}const{/blue-fg} unsorted = [34, 7, 23, 32, 5, 62];
{blue-fg}const{/blue-fg} sorted = {green-fg}quickSort{/green-fg}(unsorted);
console.log({green-fg}\`Sorted Array: \${sorted}\`{/green-fg});`;
}

function getReactComponentCode() {
  return `{magenta-fg}import{/magenta-fg} React, { useState } {magenta-fg}from{/magenta-fg} {green-fg}'react'{/green-fg};

{blue-fg}export default function{/blue-fg} {green-fg}UserProfile{/green-fg}({ {yellow-fg}username, role{/yellow-fg} }) {
  {blue-fg}const{/blue-fg} [isActive, setIsActive] = useState({blue-fg}true{/blue-fg});

  {blue-fg}return{/blue-fg} (
    <div className={green-fg}"p-6 max-w-sm mx-auto bg-slate-800 rounded-xl shadow-md space-y-4"{/green-fg}>
      <div className={green-fg}"text-xl font-medium text-white"{/green-fg}>
        {username}
      </div>
      <p className={green-fg}"text-slate-400 text-sm"{/green-fg}>Role: {role}</p>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        className={green-fg}\`px-4 py-1 text-sm text-purple-100 font-semibold rounded-full border border-purple-200 
          \${isActive ? 'bg-emerald-600' : 'bg-rose-600'}\`{/green-fg}
      >
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  );
}`;
}

function getPythonApiCode() {
  return `{magenta-fg}from{/magenta-fg} flask {magenta-fg}import{/magenta-fg} Flask, jsonify, request

app = Flask(__name__)

{gray-fg}# In-memory database mock{/gray-fg}
tasks = [
    {"id": 1, "title": "Setup Codex TUI", "done": True},
    {"id": 2, "title": "Build cool Node apps", "done": False}
]

@app.route('/api/tasks', methods=['GET'])
{blue-fg}def{/blue-fg} {green-fg}get_tasks{/green-fg}():
    {blue-fg}return{/blue-fg} jsonify({"tasks": tasks})

@app.route('/api/tasks', methods=['POST'])
{blue-fg}def{/blue-fg} {green-fg}create_task{/green-fg}():
    {blue-fg}if{/blue-fg} not request.json or not 'title' in request.json:
        {blue-fg}return{/blue-fg} jsonify({"error": "Bad Request"}), 400
    
    new_task = {
        "id": tasks[-1]['id'] + 1,
        "title": request.json['title'],
        "done": False
    }
    tasks.append(new_task)
    {blue-fg}return{/blue-fg} jsonify({"task": new_task}), 201

{blue-fg}if{/blue-fg} __name__ == '__main__':
    app.run(debug=True, port=5000)`;
}

function getGenericCode(prompt) {
  const sanitized = prompt.replace(/[^a-zA-Z0-9\s]/g, '');
  const camelCase = sanitized
    .split(' ')
    .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return `{gray-fg}/**
 * Generated helper for: "${prompt}"
 */{/gray-fg}
{blue-fg}function{/blue-fg} {green-fg}${camelCase || 'helperFunction'}{/green-fg}() {
  {gray-fg}// TODO: Implement custom logic here{/gray-fg}
  console.log("Executing custom helper for: ${sanitized}");
  {blue-fg}return{/blue-fg} {blue-fg}true{/blue-fg};
}

// Invoke the generated function
${camelCase || 'helperFunction'}();`;
}

// Render the initial screen
screen.render();
