# express_cpp1

 Version: 0.9.4

 Author  :

 date    : 2026/06/22

 update :

***

express.js C++ , API Server TODO

* json file save
* nod.js call C++ so (Shared Object)
* node 22
* LLVM CLang
* C/C++
* make
* Linux

***
* LIB add
```
sudo apt install nlohmann-json3-dev
```

***
* build
```
clang++ -shared -fPIC sample.cpp -o libsample.so
```
***
* LIB_PATH set
* src/lib/LibConfig.js
```
LIB_PATH: "/home/tmp/libsample.so",
```

***
* node start
```
node ./src/index.js
```
***
* test-code
* add
```
curl -X POST -H "Content-Type: application/json" \
 -d '{"title": "test-11"}' \
 http://localhost:3000/api/todo/create
```

* list
```
curl -X POST -H "Content-Type: application/json" \
 -d '{}' \
 http://localhost:3000/api/todo/list
```

***
