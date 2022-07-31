const express = require('express');
const app = express();
let PORT = 3042;
express.static("public")
app.use(express.static('public'))



app.get("/",(request,respond)=>{
    respond.send(`Listening on Port ${PORT}`);
})


app.listen(PORT, ()=>{
    console.log("Listening on Port: " + PORT);
})