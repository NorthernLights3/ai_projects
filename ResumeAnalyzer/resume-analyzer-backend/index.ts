import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import { Analyzer } from "../resume-analyzer-frontend/src/Analyzer";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.post("/api/ask", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        // const response = await Analyzer.AskLLM(message);
        // res.json({ response });
        res.json({ data: 'Hello World' }); // Placeholder response
    } catch (error) {
        res.status(500).json({ error: "Failed to get response from LLM" });
    }
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});