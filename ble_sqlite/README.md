# ble_sqlite

 Version: 0.9.4

 Author  :

 date    : 2026/06/22

 update :

***

node.js C++ , blessed TUI , TODO SQLite

* nod.js call C++ so (Shared Object)
* node 22
* LLVM CLang
* C/C++
* make
* Linux

***
## image

* TODO APP

![img1](/images/ble_sqlite.png)


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
node index

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
* Esc key , Ctrl + C

***
