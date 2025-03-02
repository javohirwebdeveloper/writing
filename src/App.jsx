import React, { useState } from "react";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { Send } from "lucide-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const client = ModelClient(
        "https://models.github.ai/inference",
        new AzureKeyCredential("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")
      );

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: "You are an expert IELTS essay evaluator." },
            userMessage,
          ],
          model: "gpt-4o",
          temperature: 1,
          max_tokens: 4096,
          top_p: 1,
        },
      });

      if (isUnexpected(response)) {
        throw response.body.error;
      }

      const formattedResponse = formatResponse(response.body.choices[0].message.content || "No feedback received.");
      const botMessage = { role: "assistant", content: formattedResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to fetch response." }]);
    }
    setLoading(false);
  };

  const formatResponse = (text) => {
    return text
      .replace(/---/g, "<br><br><hr><br>")
      .replace(/###\s?/g, "<br>")
      .replace(/####\s?/g, "<br>")
      .replace(/#####\s?/g, "<br>")
      .replace(/##\s?/g, "<br>")
      .replace(/#\s?/g, "")
      .replace(/^\-\s?/gm, "<br>• ")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/\(\s*<i>(.*?)<\/i>\s*,\s*<i>(.*?)<\/i>\s*\)/g, "(<i>$1</i>, <i>$2</i>)")
      .replace(/(\d+)\.\s/g, "<br><br>$1. ");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-[#dadada] flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6">Essay Checker</h1>
      <div className={`w-full mb-16 max-w-5xl flex-1 ${messages.length === 0 ? "justify-center flex items-center" : ""}  relative overflow-y-auto bg-gray-800 border-[#3D444D] border p-4 rounded-lg shadow-lg`}>
       {messages.length === 0 ? (
        <h1 className="text-white text-2xl text-center">Hi, I can check your essay.</h1>
      ) : (
         messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-2 rounded-lg max-w-[85%] ${
              msg.role === "user"
                ? "bg-gray-800 text-left ml-auto mr-4"
                : "bg-gray-800 text-left ml-4"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          ></div>
        )))}
        {loading && <div className="text-gray-500 text-left ml-4 p-3 animate-pulse">...</div>}
      </div>
      <div className="w-full max-w-4xl mx-auto flex items-center mt-4 fixed bottom-3">
        <input
          type="text"
          className="flex-1 bg-gray-800 border border-[#3D444D] rounded-md outline-none py-3 px-4 text-white focus:ring-blue-500 pr-12"
          placeholder="Type your essay..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="absolute right-3 p-3 rounded-full"
          disabled={loading}
        >
          <Send className="w-5 h-5 hover:text-blue-400 duration-200 text-blue-600" />
        </button>
      </div>
    </div>
  );
}

export default App;
