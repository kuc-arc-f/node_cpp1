import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import koffi from "koffi";

/*
const ITEM_DATA = [
  {id: "1" , title: "title-001"},
  {id: "2" , title: "title-002"},
  {id: "3" , title: "title-003"},
]
*/
const ITEM_DATA = [];

const TEST_TEXT_DATA = `Test-Text-data-001 , Test-Text-data-002 , Test-Text-data-003 , Test-Text-data-004 , Test-Text-data-005, Test-Text-data-006
Test-Text-data-001 , Test-Text-data-002 , Test-Text-data-003 , Test-Text-data-004 , Test-Text-data-005, Test-Text-data-006
Test-Text-data-001 , Test-Text-data-002 , Test-Text-data-003 , Test-Text-data-004 , Test-Text-data-005, Test-Text-data-006
Test-Text-data-001 , Test-Text-data-002 , Test-Text-data-003 , Test-Text-data-004 , Test-Text-data-005, Test-Text-data-006
`;
function SearchCommandLine() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [items, setItems] = useState(ITEM_DATA);

  const handleSubmit = (value) => {
    setSubmittedQuery(value);
    setQuery("")
    
    const lib = koffi.load('./libsample.so');
    const todoAdd = lib.func('int todo_add(const char* input)');
    const todoList = lib.func('const char* todo_list()');
    let targetStr = value;
    let responseText = "";
    if (targetStr.startsWith("add ")) {
      targetStr = targetStr.replace(/add /g, "");
      todoAdd(targetStr); 
      responseText = "OK";
    }
    if (targetStr.startsWith("list")) {
      const resp = todoList();
      const items = JSON.parse(resp);
      responseText += `TODO-LIST`;
      items.forEach((element) => {
        responseText += `\n---------------------------------------------------------------------------`;
        responseText +=`\nid= ${element.id} ${element.title}`;
      });
    }        

    setTimeout(() => {
      let uuid = crypto.randomUUID();
      const target = items;
      target.push({id: uuid , type: "user" , title: targetStr})
      uuid = crypto.randomUUID();
      target.push({id: uuid , type: "ai" , title: responseText})

      setItems(target)
      setSubmittedQuery("");
    }, 1500);		
  };

  return (
  <Box flexDirection="column" padding={1}>
    <Box flexDirection="column" padding={1}>
      {items.map(item => {
        if(item.type === "user"){
          return(
            <Box key={item.id} flexDirection="column" borderStyle="round" marginBottom={1}>
              <Text bold color="cyan">You:</Text>
              <Text>{item.title}</Text>
            </Box>
          )
        }      
        if(item.type === "ai"){
          return(
            <Box key={item.id} flexDirection="column" borderStyle="round" marginBottom={1}>
              <Text bold color="cyan">AI:</Text>
              <Text>{item.title}</Text>
            </Box>
          )
        }      
      })}
    </Box>    
    {submittedQuery ? (
      <Box marginTop={1} marginBottom={1} marginLeft={1}>
        <Text color="green" marginTop={1}>Please Wait...</Text>
      </Box>
    ):(<Box />)}
    <Box flexDirection="column" borderStyle="round" padding={2}>
      <Box marginRight={1}>
        <Text bold color="cyan">Input: </Text>
        <TextInput 
          value={query} 
          onChange={setQuery} 
          onSubmit={handleSubmit} 
        />
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>Type your text and press Enter:</Text>
      </Box>
    </Box>

  </Box>
  );
}

render(<SearchCommandLine />);
