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
    let affichage="";
    for (let i = 0; i < dishes.length; i++) {
        affichage += `<div class="card col-lg-4 card-dish" style="width: 18rem;">
        <img class="card-img-top" src="images/yassa.jpeg" alt="dish-image">
        <div class="card-body">
          <h5 class="card-title">${dishes[i].name}<span class="price">${dishes[i].price}€</span></h5>
          <p class="card-text">${dishes[i].description}</p>
          <form action="http://localhost:3000/cart/${dishes[i]._id}" method="post">
          <a href="http://localhost:3000/dishes/${dishes[i]._id}" class="btn btn-primary">Voir</a>
          <button type="submit" name="submit" class="btn btn-primary">Ajouter au panier</button>
          </form>
          </div>
    </div>
            `
    }
    console.log(affichage)
    document.querySelector('.all-dishes').innerHTML = affichage
}

fetchDishesDisplay();

