
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        {
            role: "model",
            parts: [
                {
                    text: `Hi! I'm your AI coding assistant. I'm here to help you solve "${problem.title}". Feel free to ask me about algorithms, debugging, or any coding concepts.`,
                },
            ],
        },
    ]);

    const [previousInteractionId, setPreviousInteractionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const onSubmit = async (data) => {
        const userMessage = data.message?.trim();

        if (!userMessage || loading) return;

        // Show user's message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                parts: [{ text: userMessage }],
            },
        ]);

        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                message: userMessage,
                previousInteractionId,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode,
            });

            // Save interaction ID for next message
            if (response.data.interactionId) {
                setPreviousInteractionId(response.data.interactionId);
            }

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [
                        {
                            text:
                                response.data.message ||
                                "I couldn't generate a response.",
                        },
                    ],
                },
            ]);
        } catch (error) {
            console.error("API Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [
                        {
                            text:
                                error.response?.data?.message ||
                                "Something went wrong while getting a response from the AI.",
                        },
                    ],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-125 bg-gray-900 text-gray-100">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";

                    return (
                        <div
                            key={index}
                            className={`flex ${
                                isUser ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                    isUser
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-100"
                                }`}
                            >
                                {isUser ? (
                                    <div className="whitespace-pre-wrap">
                                        {msg.parts[0].text}
                                    </div>
                                ) : (
                                    <div className="text-sm leading-7">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => (
                                                    <h1 className="text-xl font-bold mt-2 mb-4">
                                                        {children}
                                                    </h1>
                                                ),

                                                h2: ({ children }) => (
                                                    <h2 className="text-lg font-bold mt-5 mb-3">
                                                        {children}
                                                    </h2>
                                                ),

                                                h3: ({ children }) => (
                                                    <h3 className="text-base font-bold mt-5 mb-2">
                                                        {children}
                                                    </h3>
                                                ),

                                                p: ({ children }) => (
                                                    <p className="mb-4 leading-7">
                                                        {children}
                                                    </p>
                                                ),

                                                ul: ({ children }) => (
                                                    <ul className="list-disc ml-6 mb-4 space-y-2">
                                                        {children}
                                                    </ul>
                                                ),

                                                ol: ({ children }) => (
                                                    <ol className="list-decimal ml-6 mb-4 space-y-2">
                                                        {children}
                                                    </ol>
                                                ),

                                                li: ({ children }) => (
                                                    <li className="leading-6 pl-1">
                                                        {children}
                                                    </li>
                                                ),

                                                strong: ({ children }) => (
                                                    <strong className="font-bold text-white">
                                                        {children}
                                                    </strong>
                                                ),

                                                em: ({ children }) => (
                                                    <em className="italic text-gray-300">
                                                        {children}
                                                    </em>
                                                ),

                                                hr: () => (
                                                    <hr className="my-5 border-gray-600" />
                                                ),

                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-blue-400 pl-4 my-4 text-gray-300 italic">
                                                        {children}
                                                    </blockquote>
                                                ),

                                                a: ({ href, children }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 underline"
                                                    >
                                                        {children}
                                                    </a>
                                                ),

                                                code: ({
                                                    children,
                                                    className,
                                                }) => {
                                                    const isCodeBlock =
                                                        Boolean(className);

                                                    if (isCodeBlock) {
                                                        return (
                                                            <pre className="bg-gray-950 border border-gray-600 rounded-xl p-4 my-4 overflow-x-auto">
                                                                <code className="text-sm font-mono text-gray-200 whitespace-pre">
                                                                    {children}
                                                                </code>
                                                            </pre>
                                                        );
                                                    }

                                                    return (
                                                        <code className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-sm">
                                                            {children}
                                                        </code>
                                                    );
                                                },

                                                pre: ({ children }) => (
                                                    <div className="my-4 overflow-x-auto">
                                                        {children}
                                                    </div>
                                                ),

                                                table: ({ children }) => (
                                                    <div className="overflow-x-auto my-4">
                                                        <table className="w-full border-collapse border border-gray-600">
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),

                                                thead: ({ children }) => (
                                                    <thead className="bg-gray-800">
                                                        {children}
                                                    </thead>
                                                ),

                                                th: ({ children }) => (
                                                    <th className="border border-gray-600 px-3 py-2 text-left font-semibold">
                                                        {children}
                                                    </th>
                                                ),

                                                td: ({ children }) => (
                                                    <td className="border border-gray-600 px-3 py-2">
                                                        {children}
                                                    </td>
                                                ),
                                            }}
                                        >
                                            {msg.parts[0].text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* AI loading indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 rounded-2xl px-4 py-3 text-gray-300">
                            <span className="animate-pulse">
                                Thinking...
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sticky bottom-0 p-4 bg-gray-800 border-t border-gray-700"
            >
                <div className="flex items-center">
                    <input
                        type="text"
                        autoComplete="off"
                        placeholder="Ask me anything"
                        disabled={loading}
                        className="input flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:opacity-60"
                        {...register("message", {
                            required: "Message is required",
                            minLength: {
                                value: 2,
                                message:
                                    "Message must be at least 2 characters",
                            },
                        })}
                    />

                    <button
                        type="submit"
                        disabled={!!errors.message || loading}
                        className="btn bg-blue-600 border-blue-500 text-white hover:bg-blue-700 ml-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>

                {errors.message && (
                    <p className="text-red-400 text-xs mt-2">
                        {errors.message.message}
                    </p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;