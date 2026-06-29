'use strict';

const { render, Box, Text, useInput, useApp, useStdout } = require('ink');
const TextInput = require('ink-text-input').default;
const React = require('react');
const { useState, useEffect, useRef } = React;
const koffi = require('koffi');
// ─── サンプルメッセージ ──────────────────────────────────────────
const INITIAL_MESSAGES = [];

// ─── メッセージコンポーネント ────────────────────────────────────
function Message({ msg }) {
  if (msg.type === 'user') {
    return React.createElement(
      Box,
      { borderStyle: 'single', borderColor: 'cyan', marginY: 0 },
      React.createElement(Text, { bold: true, color: 'white' }, msg.text)
    );
  }

  if (msg.type === 'info') {
    return React.createElement(
      Box,
      { paddingLeft: 1 },
      React.createElement(Text, { color: 'cyan' }, msg.text)
    );
  }

  if (msg.type === 'ai') {
    return React.createElement(
      Box,
      { paddingLeft: 1 },
      React.createElement(Text, { color: 'white', wrap: 'wrap' }, msg.text)
    );
  }

  if (msg.type === 'meta') {
    return React.createElement(
      Box,
      { paddingLeft: 1 },
      React.createElement(
        Text,
        null,
        React.createElement(Text, { color: 'cyan' }, '\u25fc AI'),
        React.createElement(Text, { color: 'gray' }, ' \u00b7 ' + msg.text)
      )
    );
  }

  if (msg.type === 'code') {
    return React.createElement(
      Box,
      { borderStyle: 'round', borderColor: 'gray', flexDirection: 'column', paddingX: 1, marginX: 1 },
      msg.lines.map((line, i) => {
        const isCmd     = line.startsWith('$');
        const isOk      = line.startsWith('\u2713');
        const isComment = line.startsWith('#');
        const color = isCmd ? 'cyan' : isOk ? 'green' : isComment ? 'gray' : 'white';
        return React.createElement(Text, { key: i, color }, line || ' ');
      })
    );
  }

  return null;
}

// ─── スクロール可能メッセージペイン ─────────────────────────────
function MessagePane({ messages, height }) {
  const [scrollOffset, setScrollOffset] = useState(0);

  const lineCount = messages.reduce((acc, m) => {
    if (m.type === 'code') return acc + m.lines.length + 3;
    if (m.type === 'ai')   return acc + m.text.split('\n').length + 1;
    return acc + 2;
  }, 0);

  const maxScroll = Math.max(0, lineCount - height + 2);

  useInput((input, key) => {
    if (key.upArrow)   setScrollOffset(o => Math.max(0, o - 1));
    if (key.downArrow) setScrollOffset(o => Math.min(maxScroll, o + 1));
    if (key.pageUp)    setScrollOffset(o => Math.max(0, o - Math.floor(height / 2)));
    if (key.pageDown)  setScrollOffset(o => Math.min(maxScroll, o + Math.floor(height / 2)));
  });

  useEffect(() => {
    setScrollOffset(maxScroll);
  }, [messages.length, maxScroll]);

  const atBottom = scrollOffset >= maxScroll;

  return React.createElement(
    Box,
    { flexDirection: 'column', height, overflow: 'hidden', flexGrow: 1 },
    React.createElement(
      Box,
      { flexDirection: 'column', marginTop: -scrollOffset },
      messages.map(msg =>
        React.createElement(
          Box,
          { key: msg.id, flexDirection: 'column', marginBottom: 0 },
          React.createElement(Message, { msg })
        )
      )
    ),
    !atBottom && React.createElement(
      Box,
      { paddingLeft: 2 },
      React.createElement(Text, { color: 'gray' }, '\u2193 \u30b9\u30af\u30ed\u30fc\u30eb (\u2191\u2193 / PgUp PgDn)')
    )
  );
}

// ─── 右サイドパネル ──────────────────────────────────────────────
function SidePanel({ title, tokens, tokenPct, cost, workdir, version }) {
  return React.createElement(
    Box,
    {
      flexDirection: 'column',
      width: 34,
      paddingX: 1,
      paddingTop: 1,
      borderStyle: 'single',
      borderColor: 'gray',
      borderLeft: true,
      borderRight: false,
      borderTop: false,
      borderBottom: false,
    },
    React.createElement(Text, { bold: true, color: 'white' }, title),
    React.createElement(Text, null, ' '),
    React.createElement(Text, { bold: true, color: 'white' }, 'Context'),
    React.createElement(Text, { color: 'gray' }, tokens + ' tokens'),
    React.createElement(Text, { color: 'gray' }, tokenPct + '% used'),
    React.createElement(Text, { color: 'gray' }, cost + ' spent'),
    React.createElement(Text, null, ' '),
    //React.createElement(Text, { bold: true, color: 'white' }, 'LSP'),
    //React.createElement(Text, { color: 'gray' }, 'LSPs are disabled'),
    React.createElement(Box, { flexGrow: 1 }),
    //React.createElement(Text, { color: 'gray' }, workdir),
    React.createElement(Text, null, ' '),
    React.createElement(
      Text,
      null,
      '\u2022 ',
      React.createElement(Text, { color: 'cyan' }, 'AppName'),
      React.createElement(Text, { color: 'gray' }, ' ' + version)
    )
  );
}

// ─── ステータスバー ──────────────────────────────────────────────
function StatusBar({ tokens, tokenPct }) {
  return React.createElement(
    Box,
    {
      borderStyle: 'single',
      borderColor: 'gray',
      borderTop: true,
      borderBottom: false,
      borderLeft: false,
      borderRight: false,
      paddingX: 1,
      justifyContent: 'space-between',
    },
    React.createElement(Text, { color: 'gray' }, tokens + ' (' + tokenPct + '%)'),
    React.createElement(
      Text,
      null,
      React.createElement(Text, { bold: true, color: 'cyan' }, 'ctrl+p'),
      React.createElement(Text, { color: 'gray' }, ' commands')
    )
  );
}

// ─── 入力エリア ──────────────────────────────────────────────────
function InputArea({ value, onChange, onSubmit, model }) {
  return React.createElement(
    Box,
    { flexDirection: 'column' },
    React.createElement(
      Box,
      { borderStyle: 'single', borderColor: 'blue', paddingX: 1 },
      React.createElement(TextInput, {
        value,
        onChange,
        onSubmit,
        //placeholder: '\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u5165\u529b... (ctrl+c \u3067\u7d42\u4e86)',
        placeholder: 'Message Input... (ctrl+c : End)',
      })
    ),
    React.createElement(
      Box,
      { paddingX: 1, justifyContent: 'space-between' },
      React.createElement(
        Text,
        null,
        React.createElement(Text, { color: 'cyan' }, 'Build'),
        React.createElement(Text, { color: 'gray' }, ' \u00b7 ' + model + ' '),
        React.createElement(Text, { color: 'gray' }, 'OpenRouter')
      ),
      React.createElement(Text, { color: 'gray' }, 'ctrl+c : End , scroll: ↑↓ key')
    )
  );
}

// ─── メインアプリ ────────────────────────────────────────────────
function App() {
  const { exit }   = useApp();
  const { stdout } = useStdout();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [counter, setCounter]   = useState(INITIAL_MESSAGES.length + 1);

  const termHeight = (stdout && stdout.rows) ? stdout.rows : 40;
  const paneHeight = termHeight - 6;

  const model    = 'Gemma 4 31B (free)';
  const tokens   = '0';
  const tokenPct = '0';
  const cost     = '$0.00';
  const workdir  = '~/work/LLM/opencode/0628';
  const version  = '0.9.1';
  //const title    = 'Directory listing with permissions';
  const title    = 'Info';

  const handleSubmit = async (val) => {
    if (!val.trim()) return;
    setIsExecuting(true);

    const lib = koffi.load('./libsample.so');
    const todoAdd = lib.func('char* todo_add(const char* input)');
    const todoList = lib.func('char* todo_list()');    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ja-JP');
    setMessages(prev => [
      ...prev,
      { id: counter,     type: 'user', text: val },
    ]);
    setCounter(n => n + 1);
    let target = val;
    let responseText = "";
    if (target.startsWith("add ")) {
      target = target.replace(/add /g, "");
      todoAdd(target); 
      responseText = "OK";
    }
    if (target.startsWith("list")) {
      const resp = todoList();
      const items = JSON.parse(resp);
      responseText += `TODO-LIST`;
      items.forEach((element) => {
        responseText += `\n---------------------------------------------------------------------------`;
        responseText +=`\nid= ${element.id} ${element.title}`;
      });
    }    
    // API-Call
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: counter + 1, type: 'meta', text: timeStr },
        { id: counter + 2, type: 'ai',   text: `${responseText} ` },
        //{ id: counter + 1, type: 'ai',   text: `answer: ${responseText} ` },
        //{ id: counter + 2, type: 'meta', text: `${model} \u00b7 3.1s` },
      ]);
      setCounter(n => n + 2); 
      setIsExecuting(false);     
    }, 1500);

    setInput('');
    
  };

  return React.createElement(
    Box,
    { flexDirection: 'column', height: termHeight },
    // メインエリア（左：メッセージ ＋ 右：サイドパネル）
    React.createElement(
      Box,
      { flexGrow: 1, flexDirection: 'row' },
      React.createElement(MessagePane, { messages, height: paneHeight }),
      React.createElement(SidePanel, { title, tokens, tokenPct, cost, workdir, version })
    ),
    // ステータスバー
    React.createElement(StatusBar, { tokens, tokenPct }),
    // 実行中表示
    isExecuting && React.createElement(
      Box,
      { paddingX: 1, marginBottom: 0 },
      React.createElement(Text, { color: 'yellow' }, 'Search Wait... (Executing...)')
    ),    
    // 入力エリア
    React.createElement(InputArea, { value: input, onChange: setInput, onSubmit: handleSubmit, model })
  );
}

render(React.createElement(App));
