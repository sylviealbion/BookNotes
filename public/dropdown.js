//get the input tag elements where the data will be stored so it can be processed in the serverside
let title = document.getElementById("title");
let cover_id = document.getElementById("cover_id");
let author = document.getElementById("author");

//get the dropdown
let dropdown = document.getElementById("dropdown");

//get the list elements from the searched book
let lists = document.querySelectorAll(".book_item");

let selectedDiv = document.getElementById("selected_book");
let selected_title = document.getElementById("selected_book_title");
let selected_author = document.getElementById("selected_book_author");
let selected_cover = document.getElementById("selected_book_image");

//add an event click listener for each of the results of the book search
//and store the values to the respective input tag element.
//then hide the dropdown
//displat the selected book cover,image and author
lists.forEach((list,index)=>{
    list.addEventListener("click",()=>{
        title.value = list.querySelector(".book_title").innerHTML;
        author.value = list.querySelector(".book_author").innerHTML;
        cover_id.value = list.querySelector(".cover_image").id;
        dropdown.hidden=true;
        selectedDiv.hidden=false;
        selected_title.innerHTML = title.value;
        selected_author.innerHTML = author.value;
        selected_cover.src=`https://covers.openlibrary.org/b/id/${cover_id.value}-M.jpg`;
    });
});
