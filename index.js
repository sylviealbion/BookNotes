import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let booksArray=[];

function Book(coverID, title, authorName, key, authorKey){
    this.coverID = coverID;
    this.title = title;
    this.authorName = authorName;
    this.key = key;
    this.authorKey =authorKey;
}


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
    console.log(booksArray.length);
    res.render("entry.ejs",{books: booksArray});
});

app.post("/search", async (req,res)=>{
    booksArray=[];
    try {       
        const result = await axios.get("https://openlibrary.org/search.json",{
            params:{
                q: req.body.search,
                limit:10
            }
        });
        let resultArray = result.data.docs;
        resultArray.forEach(async item => {
            let book = new Book(
                item.cover_i,
                item.title,
                item.author_name,
                item.key.slice(7),
                item.author_key
            );
            booksArray.push(book);
        });
         console.log(booksArray);
        res.redirect("/add");
    } catch (error) {
        console.log(error);
        res.redirect("/add"); 
    }    
});

//add new data
app.post("/entry", async (req,res)=>{
    //insert into database
    res.redirect("/");
});

//edit data
app.patch("/", async (req,res)=>{
    
});

//delete data
app.delete("/", async (req,res)=>{
    
});

app.listen(port, ()=>{
    console.log(`Server started at port: ${port}`);
});