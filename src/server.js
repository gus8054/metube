import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const handleListen = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListen);
