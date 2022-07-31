const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser')
let PORT = 3042;
let myDatabase = "bookieDatabase";
let myCollection = "bookieBooks";
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(bodyParser.json())
app.set('view engine', 'ejs')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
upload.single('bookCover')
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = "mongodb+srv://demodatabase:demodatabase123321@bookie.9gqfpoa.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
});







///////// routes/////////////

app.get("/",(request,respond)=>{
    console.log("Getting All Books...")
    client.db(myDatabase).collection(myCollection).find().toArray()
        .then(r =>{
            respond.render("index.ejs", {
                "books":r
            });
            console.log(r)
        })
})


app.post("/postbook", upload.single("bookCover") ,(request,respond)=>{

    client.db(myDatabase).collection(myCollection).insertOne(
        {bookTitle:request.body.bookTitle,bookAuthor:request.body.bookAuthor, bookImg: request.file.buffer, bookLikes:0, bookDislikes:0 }
    )
        .then(()=>{
            console.log("New Book Added")
        })
        .then(()=>{
            respond.redirect("/")
        })


})



app.put("/updatelike",(request,response)=>{
    console.log("Passed ID: " + request.body.theBookId)
    client.db(myDatabase).collection(myCollection).findOneAndUpdate(
        { _id: ObjectId(request.body.theBookId)},
        {
            $set: {
                bookLikes: request.body.theBookLikeCount,
                bookDislikes:request.body.theBookDislikeCount
            }
        },
        {
            upsert: true
        }


        )
        // response.redirect("/")
        // .then(() =>{response.redirect("/")} )
        // .catch(error => console.error(error))

    }



)


app.delete("/delete", (request,respond)=>{
    console.log("Delete ID: " + request.body.theBookId)
    client.db(myDatabase).collection(myCollection).findOneAndDelete(
        {_id: ObjectId(request.body.theBookId)}
    )

        .then(respond.redirect("/"))

})





////////////end of routes//////////


app.listen(PORT, ()=>{
    console.log("Listening on Port: " + PORT);
})