import axios from "axios";
import { OpenAI } from "openai";

const API_URL = process.env.REACT_APP_HUGGINGFACE_API_URL as string;;
const API_TOKEN = process.env.REACT_APP_HUGGINGFACE_API_TOKEN as string;

export class Analyzer {
    public static async AskLLM(question: string): Promise<string> {
        try {
            // const response = await axios.post(
            //     API_URL,
            //     { inputs: question },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${API_TOKEN}`,
            //             "Content-Type": "application/json",
            //         },
            //     }
            // );

            // // Hugging Face API returns text under response.data[0].generated_text
            // return response.data[0]?.generated_text || "No response";

            const client = new OpenAI({
                baseURL: "https://router.huggingface.co/v1",
                apiKey: API_TOKEN,
            });

            const chatCompletion = await client.chat.completions.create({
                model: "meta-llama/Meta-Llama-3-8B-Instruct:novita",
                messages: [
                    {
                        role: "user",
                        content: "What is the capital of France?",
                    },
                ],
            });

            console.log(chatCompletion.choices[0].message);

            return chatCompletion.choices[0].message.content + '';
        } catch (error) {
            console.error("Error querying LLM:", error);
            return "Error querying LLM";
        }
    }
}