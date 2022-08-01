
const { getSignedUrl }  = require( "@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require( "@aws-sdk/client-s3");



const dotenv = require('dotenv').config();
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
const aws = require("@aws-sdk/client-s3")
const {PutObjectCommand} = require("@aws-sdk/client-s3");
const Crypto = require("crypto");
const crypto = require("crypto");
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey= process.env.ACCESS_KEY;
const secretAccessKey= process.env.SECRET_ACCESS_KEY;


console.log(process.env.BUCKET_REGION)

const s3 = new S3Client(
    {
        credentials:{
            accessKeyId:accessKey,
            secretAccessKey: secretAccessKey,
        },
        region:bucketRegion
    }
);






///////// routes/////////////


let theData;

app.get("/",(request,respond)=> {
    console.log("Getting All Books...")

    client.db(myDatabase).collection(myCollection).find().toArray()
        .then( async data => {
            for (const post of data) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: post.bookImg,
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {expiresIn: 300});
                post.imageUrl = url
                console.log("URL: " + url)
            }
            // respond.send(data)

            respond.render("index.ejs",{
                books:data
            })
        })



})


app.post("/postbook", upload.single("bookCover") ,(request,respond)=>{
    const randomImageName = crypto.randomBytes(32).toString('hex')
    console.log("Random Name: " + randomImageName)
    const params = {
        Bucket:bucketName,
        Key: randomImageName,
        Body: request.file.buffer,
        ContentType: request.file.mimetype,
    }

    const command = new PutObjectCommand(params)

    s3.send(command).then(r =>(console.log("book cover uploaded")) )

    client.db(myDatabase).collection(myCollection).insertOne(
        {bookTitle:request.body.bookTitle,bookAuthor:request.body.bookAuthor, bookImg:randomImageName, bookLikes:0, bookDislikes:0 }
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