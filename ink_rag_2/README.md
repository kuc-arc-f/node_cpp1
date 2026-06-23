# ink_rag_2

 Version: 0.9.4

 Author  :

 date    : 2026/06/23

 update :

***

node.js C++ , Ink TUI RAG Qdrant

* node.js call C++ so (Shared Object)
* node 22
* LLVM CLang
* embedding : Gemini-embedding-001
* model: gemma-4-E2B
* llama.cpp , llama-server
* make
* Linux

***
### vector data add

https://github.com/kuc-arc-f/cpp_3ex/tree/main/rag_19

***
## Image

* RAG APP

![img1](/images/ink_rag_2.png)


***
* llama-server start
* port 8090: gemma-4-E2B

```
#gemma-4-E2B

/usr/local/llama-b8642/llama-server -m /var/lm_data/unsloth/gemma-4-E2B-it-Q4_K_S.gguf \
 --chat-template-kwargs '{"enable_thinking": false}' --port 8090 
```

***
### related

https://huggingface.co/unsloth/gemma-4-E2B-it-GGUF

***
* LIB add
```
sudo apt install uuid-dev
sudo apt install nlohmann-json3-dev
sudo apt install libcurl4-openssl-dev
```

***
* env value

```
export GEMINI_API_KEY=your-key
```

***
* C++ build
```
make all
```

***
* node start
```
npm i
npm run start
```

***
* End
* Ctrl + C

***
