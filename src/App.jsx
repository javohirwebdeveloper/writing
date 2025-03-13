import React, { useState } from "react";
import { Send } from "lucide-react";
import Icon from "./assets/icon.png";

const API_URL = "https://api.gpt4-all.xyz/v1";
const API_KEY = "g4a-P424liNA4BNxcQjUSZZCzBeMMfmZjtchl5F";

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
      const response = await fetch(`${API_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a highly skilled IELTS examiner and writing coach. Your task is to **fairly** evaluate essays while providing **powerful, practical strategies** to **rapidly improve writing skills**. Your feedback should be **realistic, structured, and motivating**.

## **🚀 Scoring Guidelines (DO NOT Underrate!!!)**
- **Be fair!!! and objective!!!**. If an essay deserves **Band 8+, do NOT give it 6.5**.  
- **Follow official IELTS descriptors**, ensuring accurate scores.  
- **Highlight strong points** and encourage further improvement.  

---

## **📊 Detailed Feedback Structure**
### **Task Response (Score: X/9)**
✅ **Strengths**: Mention what is done well (clear ideas, relevant examples, strong arguments).  
⚡ **How to Improve**: Suggest how to make arguments deeper and more persuasive.  

### **Coherence & Cohesion (Score: X/9)**
✅ **Strengths**: Highlight good organization and logical flow.  
⚡ **How to Improve**: Give specific linking strategies (e.g., advanced transition words, paragraph structuring).  

### **Lexical Resource (Score: X/9)**
✅ **Strengths**: Identify strong vocabulary use.  
⚡ **How to Improve**: Suggest **specific** advanced synonyms and paraphrasing techniques.  

### **Grammatical Range & Accuracy (Score: X/9)**
✅ **Strengths**: Mention correctly used complex structures.  
⚡ **How to Improve**: Identify mistakes and **provide re-written example sentences** for clarity.  

---

## **🔥 REALISTIC IELTS Improvement Strategies**
At the end of your feedback, provide **customized** rapid improvement methods based on weaknesses. Your advice should be:  
1️⃣ **Highly Practical** – Techniques that can be applied **immediately**.  
2️⃣ **Efficient** – Focus on the most **impactful** improvements.  
3️⃣ **Realistic** – Should be **achievable and measurable**.  

### **📌 Writing Acceleration Techniques**
🔹 **Grammar Weakness** → Suggest **shadow writing** (rewriting essays in a more complex way) + AI grammar check tools.  
🔹 **Weak Arguments** → Recommend **debate-style exercises** (e.g., argue for/against topics daily).  
🔹 **Limited Vocabulary** → Provide a **list of high-impact words** with usage examples.  
🔹 **Slow Writing Speed** → Recommend **time-based writing drills** (e.g., 5-minute essay outlines).  
🔹 **Weak Coherence** → Suggest reading and summarizing **high-band essays** to learn structuring.  

💡 **Final Note:**  
- Be **supportive and constructive** while maintaining realism.  
- If an essay is **strong**, acknowledge it and encourage further development.  
- If an essay needs work, provide **powerful, strategic solutions** instead of just criticism.  
- The goal is **rapid and effective progress** for the writer.  
` },
            userMessage,
          ],
          stream: false,
        }),
      });

      const data = await response.json();
      const botMessage = {
        role: "assistant",
        content: formatResponse(data.choices[0]?.message?.content || "No response"),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error checking essay" }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-[#dadada] flex flex-col items-center p-2">
      <div className={`w-full mb-2 max-w-7xl flex-1 ${messages.length === 0 ? "justify-center flex items-center" : ""}  relative overflow-y-auto mx-auto bg-gray-800 border-[#3D444D] border md:p-4 md:px-20 p-2 rounded-lg shadow-lg`}>
       {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-2"><img src={Icon} className=" w-16 mb-7 rounded-full" alt="" /> <h1 className="text-3xl text-white font-semibold">Notivo-v1</h1><h2 className="text-[#9198A1] text-md text-center tenor-sans-regular">Notivo is an essay checker and enhance your writing. Get precise feedback, structured scoring, improve your essays effectively.</h2></div>
      ) : (
         messages.map((msg, index) => (
          <div
            key={index}
            className={`md:p-3 p-1 my-2 ${msg.role === "user" ? "flex justify-end bg-gray-700" :""}  md:text-sm text-xs rounded-lg  ${
              msg.role === "user"
                ? "bg-gray-800 text-left md:mr-4 md:ml-auto ml-4 mr-2"
                : "bg-gray-800 text-left mt-5 "
            }`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          ></div>
        )))}
        {loading && <div className="snippet md:ml-3 flex flex-col ml-3 mt-5 w-16 items-center mb-[50%]">
          <div className='flex items-center md:text-2xl text-lg gap-2 mb-2'><img src={Icon} className='rounded-full md:w-9 md:h-9 w-7 h-7' alt='Notivo Logo'/><strong className="md:text-lg">Notivo</strong></div>
        <div className="stage">
          <div className="dot-elastic"></div>
        </div>
      </div>}
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 flex items-center mt-4 fixed bottom-7">
        <input
          type="text"
          className="flex-1 bg-gray-800 border border-[#454c57] rounded-md outline-none py-3 px-4 text-white focus:ring-blue-500 pr-12"
          placeholder="Type your essay..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="absolute right-3 p-3 pr-5 rounded-full" disabled={loading}>
          <Send className={`${input === "" ? "text-[#dadada]" : "text-blue-500 hover:text-blue-400"} w-5 h-5 duration-200 `} />
        </button>
      </div>
    </div>
  );
}

export default App;
