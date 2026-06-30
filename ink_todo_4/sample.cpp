#include <iostream>
#include <string> // 文字列を扱うために必要
#include <cstring>
#include "include/my_todo.hpp"

extern "C" {

int add(int a, int b)
{
    return a + b;
}

const char* hello()
{
    return "Hello From C++";
}

const char* greet(const char* name)
{
    static std::string msg;
    msg = "Reply:";
    msg += name;
    return msg.c_str();
}

int todo_delete(int id)
{
    MyTodo todo_helper("");
    todo_helper.todo_delete_handler(id);
    return 1;
}

char* todo_list()
{
    MyTodo todo_helper("");
    std::string result = todo_helper.todo_list_handler();
    char* output = new char[result.length() + 1];
    strcpy(output, result.c_str());
    return output;    
}

char* todo_add(const char* input)
{
    std::string input_str(input);
    //std::cout << "todo_add.Received in C++: " << input_str << std::endl;
    MyTodo todo_helper("");
    std::string result = todo_helper.todo_add_handler(input_str);
    char* output = new char[result.length() + 1];
    strcpy(output, result.c_str());
    return output;    
}

}