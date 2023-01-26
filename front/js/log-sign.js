let user = []
const fetchDishesDisplay = async () => {
    await fetch('http://localhost:3000/login', { method: 'POST' }).then((response) => response.json())
    .then((promise) => {
        user = promise
        console.log(promise)
    });

    window.localStorage.setItem('token',`${user[0].token}`)
    window.localStorage.setItem('userLogin',`${user[0].token}`)  
}


function auth(){
    fetchDishesDisplay();
    let affichage = `<h3>Bienvenue <em>${user[0].name}</em></h3>` ;
    console.log(affichage)
    document.querySelector('.welcome-word').innerHTML = affichage
    window.location.assign("../html/index.html")
}


