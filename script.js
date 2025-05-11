const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const User = require("./models/User");
const app = express();
require('dotenv').config();
const PORT;
const mongoDbURL;
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

mongoose.connect(mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection error:", err));

app.get("/", async (req, res) => {
    try {
        const blogs = await User.find().sort({ createdAt: -1 });
        res.render("index", { blogs });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching blogs");
    }
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.get("/edit/:id", async (req, res) => {
    try {
        const blog = await User.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        res.render("edit", { blog });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error finding blog for edit");
    }
});

app.get("/detail/:id", async (req, res) => {
    try {
        const blog = await User.findById(req.params.id);
        console.log('Blog found:', blog);

        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        res.render("detail", { blog });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error finding blog details");
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        // Find the blog by ID
        const blog = await User.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        // Delete the blog
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting blog");
    }
});

app.post("/edit/:id", async (req, res) => {
    const { name, surname, body } = req.body;
    try {
        const blog = await User.findByIdAndUpdate(
            req.params.id,
            { name, surname, body }
        );

        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        res.redirect("/detail/" + req.params.id);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating blog");
    }
});

app.post("/create", async (req, res) => {
    const { name, surname, body } = req.body;
    try {
        const user = new User({ name, surname, body });
        await user.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating blog");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
