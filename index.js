import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let booksArray=[];
let bookNotes={};

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
    const books = [];
    try {
        const results = await db.query("SELECT id, title, author, rating, review, date_read, cover_id FROM books");        
        results.rows.forEach((result)=>{
            books.push(result);
        });
        res.render("index.ejs", {books: books});
    } catch (error) {
        console.log(error);
        res.render("index.ejs", {books: books});
    }
   
});
//view all book notes and other data
app.get("/view/:id", async (req,res)=>{
    const id = req.params.id;
    let book = {};
    try {
        const results = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        book = {
            id: results.rows[0].id,
            title: results.rows[0].title,
            author: results.rows[0].author,
            rating: results.rows[0].rating,
            review: results.rows[0].review,
            notes: results.rows[0].notes,
            date: results.rows[0].date_read,
            cover: results.rows[0].cover_id,
        };     
        res.render("notes.ejs", {book});
    } catch (error) {
        console.log(error);
        res.render("notes.ejs", {book});
    }   
});

//go to add and entry page
app.get("/add", async (req,res)=>{
    booksArray=[];
    bookNotes={};
    res.render("entry.ejs",{books: booksArray, notes: bookNotes});
});

//search for book to review and add notes to
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
            );
            booksArray.push(book);
        });
        res.render("entry.ejs",{books: booksArray, notes: bookNotes});
    } catch (error) {
        console.log(error);
        res.redirect("/add"); 
    }    
});

//add new book notes entry
app.post("/entry", async (req,res)=>{
    const date = new Date(); 
    const date_today = date.toLocaleString("default",{month: "long"}) + " " + date.getDate() + ", " + date.getFullYear()
    const title = req.body.title;
    const author = req.body.author;
    const coverID = req.body.cover_id;
    const rating = req.body.rating;
    const review = req.body.review;    
    const notes = req.body.notes;
    
    try {
        await db.query("INSERT INTO books (title, author, rating, review, date_read, notes, cover_id) VALUES ($1,$2, $3, $4, $5, $6, $7)",
        [title, author, rating, review,date_today, notes, coverID]);    
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }

});

//edit data go to edit page
app.post("/edit/:id", async (req,res)=>{
    bookNotes = {};
    booksArray=[];
    const id=  req.params.id;
    // let notes = {};
    try {
        const results = await db.query("SELECT * FROM books WHERE id = $1",[id]);
        bookNotes = {
            id: results.rows[0].id,
            title: results.rows[0].title,
            author: results.rows[0].author,
            rating: results.rows[0].rating,
            review: results.rows[0].review,
            notes: results.rows[0].notes,
            date: results.rows[0].date_read,
            cover: results.rows[0].cover_id
        };
        // bookNotes.push(notes);
        res.render("entry.ejs",{books: booksArray, notes: bookNotes});
    } catch (error) {
        console.log(error);
        res.redirect(`/view/${id}`);
    }
});
//update database from edit
app.post("/update", async (req,res)=>{
    const date = new Date();
    const date_today = date.toLocaleString("default",{month: "long"}) + " " + date.getDate() + ", " + date.getFullYear();
    const title = req.body.title;
    const author = req.body.author;
    const coverID = req.body.cover_id;
    const rating = req.body.rating;
    const review = req.body.review;    
    const notes = req.body.notes;
    const id = req.body.book_id;
    try {
        await db.query("UPDATE books SET title=$1, author=$2, rating=$3, review=$4, date_read=$5, notes=$6, cover_id=$7 WHERE id=$8",[title, author, rating, review, date_today, notes, coverID, id]);    
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }

});

//delete data
app.post("/delete/:id", async (req,res)=>{
    const id = req.params.id;
    try {
        await db.query("DELETE FROM books WHERE id = $1",[id]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/"); 
    }
    
});

app.listen(port, ()=>{
    console.log(`Server started at port: ${port}`);
});