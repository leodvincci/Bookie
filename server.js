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
    client.close();
});







///////// routes/////////////

app.get("/",(request,respond)=>{
    respond.send(`Listening on Port ${PORT}`);
})


app.post("/postbook",(request,respond)=>{

    respond.send("You Posted A new book!! Congrats!")

    // client.db(myDatabase).collection(myCollection).insertOne(
    //     { bookTitle:"Inspired",bookAuthor:"Marty Cagan",bookImg: "https://covers.openlibrary.org/b/id/9700654-L.jpg", bookLikes:0,bookDislikes:0 }
    // )


})






////////////end of routes//////////


app.listen(PORT, ()=>{
    console.log("Listening on Port: " + PORT);
})