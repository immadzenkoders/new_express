const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable or fallback to a default value
const userRouter = require("./src/routes/userRoutes");

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
