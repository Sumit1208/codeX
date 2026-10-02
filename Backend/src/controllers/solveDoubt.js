const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});

const solveDoubt = async (req, res) => {
    try {
        const {
            message,
            previousInteractionId,
            title,
            description,
            testCases,
            startCode
        } = req.body;

        // Check request data
        console.log("AI Request:", {
            message,
            previousInteractionId,
            title
        });

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const systemInstruction = `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:

[PROBLEM_TITLE]:
${title}

[PROBLEM_DESCRIPTION]:
${description}

[EXAMPLES]:
${JSON.stringify(testCases, null, 2)}

[START_CODE]:
${JSON.stringify(startCode, null, 2)}

## YOUR CAPABILITIES:

1. Hint Provider
   - Give step-by-step hints without immediately revealing the complete solution.

2. Code Reviewer
   - Debug and fix code submissions with clear explanations.

3. Solution Guide
   - Provide optimal solutions with detailed explanations.

4. Complexity Analyzer
   - Explain time and space complexity.

5. Approach Suggester
   - Recommend brute force and optimized approaches.

6. Test Case Helper
   - Help create additional test cases and edge cases.

## INTERACTION GUIDELINES:

### When user asks for HINTS:
- Break the problem into smaller parts.
- Ask guiding questions.
- Provide algorithmic intuition.
- Suggest relevant data structures and techniques.

### When user submits CODE:
- Identify bugs and logic errors.
- Explain why the code fails.
- Suggest improvements.
- Provide corrected code when appropriate.

### When user asks for OPTIMAL SOLUTION:
- Explain the approach first.
- Provide clean code.
- Explain the algorithm step-by-step.
- Include time and space complexity.

### When user asks for DIFFERENT APPROACHES:
- Compare multiple approaches.
- Explain trade-offs.
- Include complexity analysis.

## RESPONSE FORMAT:
- Give clear and concise explanations.
- Use Markdown.
- Format code using proper code blocks.
- Use examples when helpful.
- Always relate the answer to the current DSA problem.
- Respond in the language the user is comfortable with.

## STRICT LIMITATIONS:
- ONLY discuss the current DSA problem.
- DO NOT answer unrelated web-development, database, or general programming questions.
- DO NOT solve a different problem.

If the user asks something unrelated, respond:

"I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"
`;

        const interaction = await ai.interactions.create({
            model: "gemini-3.7-flash",

            // Current user's message
            input: message,

            // Continue previous conversation when available
            ...(previousInteractionId && {
                previous_interaction_id: previousInteractionId
            }),

            system_instruction: systemInstruction
        });

        return res.status(200).json({
            success: true,
            message: interaction.output_text,
            interactionId: interaction.id
        });

    } catch (err) {
        console.error("Gemini Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

module.exports = solveDoubt;