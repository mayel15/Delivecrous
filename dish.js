// 
let dishes = []
const fetchDishes = async () => {
    await fetch('http://localhost:3000/dishes', { method: 'GET' }).then((response) => response.json())
        .then((promise) => {
            dishes = promise
            console.log(promise)
        })

};


const fetchDishesDisplay = async () => {
    await fetchDishes();
    //const dishFound = dishes.find((m))
    let affichage;
    for (let i = 0; i < dishes.length; i++) {
        affichage += `<img class="card-img-top col-lg-6" src="images/yassa.jpeg" alt="dish-image">
        <div class="dish-text col-lg-6">
            <h3 class="card-title">${dishes[i].name}<span class="price-dish">${dishes[i].price}€</span></h3>
            <p class="card-text">${dishes[i].description}</p>
            <a method="post" action="/cart/:id" class="btn btn-primary">Ajouter au panier</a>
        </div>
            `
    }
    console.log(affichage)
    document.querySelector('.all-dishes').innerHTML = affichage
}

fetchDishesDisplay();

