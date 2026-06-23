# ink_sqlite

 Version: 0.9.4

 Author  :

 date    : 2026/06/22

 update :

***

node.js C++ , Ink TUI , TODO SQLite Database

* node.js call C++ so (Shared Object)
* node 22
* LLVM CLang
* C/C++
* make
* Linux

***
## image

* TODO APP

![img1](/images/ink_sqlite.png)


***
* LIB add
```
sudo apt-get install libsqlite3-dev
sudo apt install nlohmann-json3-dev
```

***
* build
```
clang++ -shared -fPIC -lsqlite3 sample.cpp -o libsample.so
```

***
* node start
```
npm i
npm run start
```
***
* operation command
* add
```
add hello
```

* list
```
list
```

***
* End
* Ctrl + C

***
