const stars = document.querySelectorAll(".bi-star-fill");
let rating = document.getElementById("rating");

stars.forEach((star, index1)=>{
    console.log(index1);
    if((index1+1)<=rating.value){
        
        star.classList.add("selected");
    }

    //add event listener to the stars so that when mouse hovers at star, it will change color along with the stars to its left
    star.addEventListener("mouseenter",()=>{
        stars.forEach((star, index2)=>{
            if(index2 <= index1){
                star.classList.add("selected");
            }else{
                star.classList.remove("selected");
            }
        });
    });

    //add event listener to the stars so that when mouse clicks at star, it will change color along with the stars to its left
    star.addEventListener("click", ()=>{
        rating.value = index1 + 1;  //and set the value for the rating based on what star the user clicks
        stars.forEach((star, index2)=>{
            if(index2 <= index1){
                star.classList.add("selected");
            }else{
                star.classList.remove("selected");
            }
        });
    });
});
