const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 3200;

app.set("view engine","ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let blogs = [];

app.get("/",(req,res)=>{
    res.render("index",{blogs});
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.get("/edit/:id", (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);
    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    res.render("edit", { blog });
});

app.get("/detail/:id", (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);
    console.log('Blog found:', blog);

    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    res.render("detail", { blog });
});

app.get("/delete/:id",(req,res)=>{
    const blog = blogs.findIndex(b => b.id === req.params.id);
    if(blog === -1){
        return res.status(404).send("Blog not found");
    }
    blogs.splice(blog,1);
    res.redirect("/");
})

app.post("/edit/:id",(req,res)=>{
    const {name,surname,body} = req.body;
    const editId = blogs.findIndex(b => b.id === req.params.id);
    if(editId === -1)
    { return res.status(404).send("Blog not found"); }
    blogs[editId] = { id: req.params.id, name, surname, body };
    res.redirect("/detail/" + req.params.id);
})


app.post("/create", (req, res) => {
    const { name, surname, body } = req.body;
    const id = Date.now().toString();
    blogs.push({ name, surname, body, id });
    console.log(blogs);
    res.redirect("/");
});

app.listen(PORT,console.log("hehhehe"))