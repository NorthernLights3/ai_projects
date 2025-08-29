import React, { useEffect, useState } from "react";

export const Home: React.FC = () => {
    const [greeting, setGreeting] = useState<string>("Hello....");

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("http://localhost:3001/api/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: "What is the capital of France?" }),
                });

                let result = await response.json();
                setGreeting(result.data + '');
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