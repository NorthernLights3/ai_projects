import axios from "axios";

const API_URL = process.env.REACT_APP_HUGGINGFACE_API_URL as string;;
const API_TOKEN = process.env.REACT_APP_HUGGINGFACE_API_TOKEN as string;

export class Analyzer {
    public static async AskLLM(question: string): Promise<string> {
        try {
            const response = await axios.post(
                API_URL,
                { inputs: question },
                {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Hugging Face API returns text under response.data[0].generated_text
            return response.data[0]?.generated_text || "No response";
        } catch (error) {
            console.error("Error querying LLM:", error);
            return "Error querying LLM";
        }
    }
}

// TODO: put this in a test case.
// Example usage
(async () => {
    const answer = await Analyzer.AskLLM("What is the capital of France?");
    console.log("LLM answer:", answer);
})();
