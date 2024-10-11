const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

//app.arguments(cors(corsOptions));

app.get("/api", (req,res) =>{
    res.json({ comment: ["example response"]});
});

app.listen(8080, () => {
    console.log("Server is runnong on port 8080")
});