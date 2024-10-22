import express from "express";
import cors from "cors";
import departuresApi from "./routes/departuresApi.js";

const app = express();
const corsOptions = {
   origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next(); // Gå vidare till nästa middleware eller route
});

// Use the departures API routes
app.use("/api", departuresApi);

app.get("/api", (req, res) => {
   res.json({ comment: ["example response"] });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
});
