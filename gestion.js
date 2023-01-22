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
    let affichage;
    for (let i = 0; i < dishes.length; i++) {
        affichage += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
        <img class="card-img-top img-cart-dish" src="images/yassa.jpeg" alt="yassa-image">
        <p>${dishes[i].name}</p> 
        <a href=""><i class="fa-solid fa-pen"></i></a>
        <a href=""><i class="fa-solid fa-trash"></i></a>
        </li>
        `
    }
    console.log(affichage)
    document.querySelector('.list-all-dishes').innerHTML = affichage
}

fetchDishesDisplay();

