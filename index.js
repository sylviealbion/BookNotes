import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "123456",
    port: 5432,
  });

  db.connect();

//display all data
app.get("/", async (req,res)=>{
    res.render("index.ejs");
});
//chage view to /view/:id
app.get("/view", async (req,res)=>{
    res.render("notes.ejs");
});

//go to add and entry page
app.get("/add", async (req,res)=>{
    res.render("addentry.ejs");
});


//add new data
app.post("/entry", async (req,res)=>{
    //insert into database
    res.redirect("/");
});

//edit data
app.post("/", async (req,res)=>{
    
});

//delete data
app.post("/", async (req,res)=>{
    
});

app.listen(port, ()=>{
    console.log(`Server started at port: ${port}`);
});