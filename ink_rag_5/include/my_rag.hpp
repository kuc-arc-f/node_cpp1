#pragma once
#include <cstdlib>
#include <iostream>
#include <fstream>
#include <filesystem>
#include <vector>
#include <string>
#include <sstream>
#include <stdexcept>
#include <map>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

#include "GeminiEmbeddingClient.hpp"
//#include "db_search.hpp"
#include "my_config.hpp"
#include "qdrant_client.hpp"
#include "openrouter_client.hpp"

using json = nlohmann::json;

//const std::string DB_PATH = "example.db";
//const std::string DATA_PATH = "./data";
const std::string COLLECTION = "document-1";
const size_t      VECTOR_DIM = 3072;  // ベクトル次元


// 1ファイル分のデータを保持する構造体
struct TextFile {
    std::string filename;
    std::vector<std::string> lines;
};

// .txt ファイルを読み込んで行を返す
TextFile loadTextFile(const std::filesystem::path& filepath) {
    TextFile tf;
    tf.filename = filepath.filename().string();

    std::ifstream ifs(filepath);
    if (!ifs.is_open()) {
        std::cerr << "[警告] ファイルを開けません: " << filepath << "\n";
        return tf;
    }

    std::string line;
    while (std::getline(ifs, line)) {
        tf.lines.push_back(line);
    }
    return tf;
}

class MyRag {
private:
    std::string m_name;

    public:
    explicit MyRag(std::string str){}

    ~MyRag() {}

    std::string rag_search_handler(std::string query){
        try{
            std::string ret = "";
            // API_KEYを環境変数から取得（または直接設定）
            const char* api_key = std::getenv("OPENROUTER_API_KEY");
            if (api_key != nullptr) {
                //std::cout << "api_key:" << api_key << std::endl;
            }else{
                std::cerr << "Error: OPENROUTER_API_KEY environment variable not set" << std::endl;
                std::cerr << "Please set it with: export OPENROUTER_API_KEY=your_api_key_here" << std::endl;
                return ret;
            }      
            const char* model_name = std::getenv("OPENROUTER_MODEL");
            if (!model_name) {
                std::cerr << "Error: OPENROUTER_MODEL environment variable not set" << std::endl;
                return ret;
            }      

//            std::string dirPath = DATA_PATH;

            auto embeddings = EmbeddingStart(query);
            //std::cout << "vlen=" << embeddings.size() << std::endl;
            auto vec = embeddings;

            QdrantClient qdrant_client("localhost", 6333);
            //std::cout << "=== Qdrant C++ クライアント===\n\n";
            auto results = qdrant_client.search(COLLECTION, embeddings, 1);
            std::string matches = "";
            for (const auto& r : results) {
                //std::cout << "  score: " << std::fixed << std::setprecision(4) << r.score
                //        << "\n";
                //std::cout << "r.score=" << r.score << "\n";
                std::string content = r.payload["content"].get<std::string>();
                if(r.score > 0.6) {
                    matches = content;
                }
            }
            std::string out_str = "要約して欲しい。\n";
            std::string resp_str = matches;
            if(resp_str.empty()){
                out_str.append("user query: ");
                out_str.append(query);
                out_str.append(" \n");
            }else{
                out_str.append("context:");
                out_str.append(resp_str);
                out_str.append("\n user query: ");
                out_str.append(query);
                out_str.append(" \n");
            }
            //std::cout << out_str  << std::endl;
            OpenRouterClient client(api_key);
            auto response = client.sendChatCompletion(
                model_name,
                out_str,
                1.0,
                2000
            );
            if (response.has_value()) {
                //std::cout << "Response: " << response.value() << std::endl;
                auto outStr = response.value();
                ret = outStr;
                return ret;
            } else {
                std::cerr << "Failed to get response from API" << std::endl;
                return ret;
            }
            return ret;
        } catch (const std::exception& e) {
            std::cout << "Error , main" << std::endl;
        }  
    }


};
