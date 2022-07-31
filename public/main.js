console.log("Hello World")
const book_Card = document.querySelector("#card-id-0")
const bookCard = document.querySelectorAll(".book-card")
const likeBtn = document.querySelectorAll(".like-icon");
const dislikeUpdate = document.querySelectorAll("#dislike-icon")
const likeCount = document.querySelectorAll("#like-count")


console.log(book_Card.children)
// console.log(bookCard.children[7].innerText)
//
bookCard.forEach( bc =>{
    let likeCount = Number(bc.children[8].innerText);
    let disLikeCount = Number(bc.children[7].innerText);
    let bookId = bc.children[0].id;

    bc.children[6].addEventListener("click", ()=>{
        console.log("Book ID: " + bookId)
        console.log("Like Count: " + likeCount)


        fetch('/updatelike', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theBookLikeCount:likeCount+ 1,
                theBookDislikeCount:disLikeCount,
                theBookId:bookId
            })

        })
        setTimeout(()=>{location.reload()},100)
    })


    bc.children[9].addEventListener("click", ()=>{
        console.log("Book ID: " + bookId)
        console.log("Dislike Count: " + disLikeCount)


        fetch('/updatelike', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theBookLikeCount:likeCount,
                theBookDislikeCount:disLikeCount + 1,
                theBookId:bookId
            })

        })
        setTimeout(()=>{location.reload()},100)
    })


    bc.children[5].addEventListener("click", ()=> {

        fetch('/delete', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theBookId:bookId
            })

        })
        setTimeout(()=>{location.reload()},100)

    })

})

