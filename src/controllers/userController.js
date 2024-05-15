// userController.js
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "TESTAPI"; 
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const getUsersFromFile = () => {
    try {
        const usersData = fs.readFileSync(usersFilePath);
        return JSON.parse(usersData);
    } catch (error) {
        return [];
    }
};

const saveUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const users = getUsersFromFile();
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = { id: Date.now(), username, email, password };
        users.push(newUser);
        saveUsersToFile(users);
        const token = jwt.sign({ email: newUser.email, id: newUser.id }, SECRET_KEY);
        res.status(201).json({ user: newUser, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = getUsersFromFile();
        const existingUser = users.find(user => user.email === email);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found or invalid credentials" });
        }
        if (existingUser.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, SECRET_KEY);
        res.status(200).json({ user: existingUser, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = { signup, signin };
