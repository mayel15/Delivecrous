// 
/*let dishes= []

var myInit = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'no-cors',
    cache: 'default'
};

let myRequest = new Request("http://localhost:3000/dishes", myInit)
const fetchDish = async () => {
    await fetch(myRequest)
    .then((res) =>{
        if(res.ok){
            res.json()
        }
        else{
            console.log("Erreur")
        }
    })
    .then((promise)=>{
        dishes = promise;
        console.log(promise);
    })
};


const dishesDisplay = async () =>{
    await fetchDish();
    document.getElementById("bloc").innerHTML = dishes.map(
        (dish) => `
        <div id="card${dish._id}">
            <h3>${$dish.name}</h3> 
            <h3>${$dish.description}</h3>
            <h3>${$dish.price.toString()}</h3>
        </div>
        `
    )
};

dishesDisplay();*/