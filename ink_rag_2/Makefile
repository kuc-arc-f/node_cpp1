CXX = clang++
#CXX = g++
#CXXFLAG_1= -I./include -I/prog/vcpkg/installed/x64-windows/include

CXXFLAGS = -shared -fPIC -std=c++17 -lcurl -luuid
#CXXFLAGS = -std=c++17 $(CXXFLAG_1) $(CXXFLAG_2)

TARGET = libsample.so
all: $(TARGET)

$(TARGET): sample.o
	$(CXX) $(CXXFLAGS) sample.o -o $(TARGET)

sample.o: sample.cpp
	$(CXX) $(CXXFLAGS) -c sample.cpp

clean:
	rm *.o $(TARGET)
