import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: `Hi! I'm your AI coding assistant. I'm here to help you solve "${problem.title}". Feel free to ask me about algorithms, debugging, or any coding concepts!`}]},
        
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        
        setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
        reset();

        try {
            
            const response = await axiosClient.post("/ai/chat", {
                messages:messages,
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode
            });
           
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-125 bg-gray-900 text-gray-100">
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
            <div 
                key={index} 
                className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
            >
                <div className={`chat-bubble ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"}`}>
                    {msg.parts[0].text}
                </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
    </div>
    <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="sticky bottom-0 p-4 bg-gray-800 border-t border-gray-700"
    >
        <div className="flex items-center">
            <input 
                placeholder="Ask me anything" 
                className="input flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                {...register("message", { required: true, minLength: 2 })}
            />
            <button 
                type="submit" 
                className="btn bg-blue-600 border-blue-500 text-white hover:bg-blue-700 ml-2"
                disabled={errors.message}
            >
                <Send size={20} />
            </button>
        </div>
    </form>
</div>
    );
}

export default ChatAi;