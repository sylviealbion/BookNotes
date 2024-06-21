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
    database: "",
    password: "123456",
    port: 5432,
  });

  db.connect();

//display all data
app.get("/", async (req,res)=>{

});

//add new data
app.post("/", async (req,res)=>{
    
});

//edit data
app.post("/", async (req,res)=>{
    
});

//delete data
app.post("/", async (req,res)=>{
    
});