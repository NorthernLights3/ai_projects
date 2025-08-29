import React, { useEffect, useState } from "react";
import { Analyzer } from "./Analyzer";

export const Home: React.FC = () => {
    const [greeting, setGreeting] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                let response = await Analyzer.AskLLM("What is the capital of France?");
                setGreeting(response);
            } catch (error) {
                console.error("Error fetching greeting:", error);
                setGreeting("Error fetching greeting");
            }
        })();
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <p>Greeting: {greeting}</p>
        </div>
    );
};