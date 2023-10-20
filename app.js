const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 2000;
const MONGO_URL = "mongodb://127.0.0.1:27017/Weather";
const Contact = require("./models/contact.js");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
 // Serve files from the "public" directory

// Middleware to serve index.html

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log("Cannot connect to DB");
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.post("/", async (req, res) => {
    const contact = new Contact(req.body);

    try {
        await contact.save();
        console.log("Contact saved:", contact);
        res.redirect("/index.html"); // Redirect to index.html after saving the contact
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).send("Error saving contact");
    }
});

app.use(express.static(path.join(__dirname, "other")));

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "other", "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
