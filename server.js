const express = require('express');
const app = express();
const bodyParser = require('body-parser')
let PORT = 3042;
let myDatabase = "bookieDatabase";
let myCollection = "bookieBooks";
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://demodatabase:demodatabase123321@bookie.9gqfpoa.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
});







///////// routes/////////////

app.get("/",(request,respond)=>{
    respond.send(`Listening on Port ${PORT}`);
})


app.post("/postbook",(request,respond)=>{

    client.db(myDatabase).collection(myCollection).insertOne(
        {bookTitle:request.body.bookTitle,bookAuthor:request.body.bookAuthor, bookImg: "", bookLikes:0, bookDislikes:0 }
    )
        .then(()=>{
            console.log("New Book Added")
        })
        .then(()=>{
            respond.redirect("/")
        })


})






////////////end of routes//////////


app.listen(PORT, ()=>{
    console.log("Listening on Port: " + PORT);
})