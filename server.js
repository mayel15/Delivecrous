const jwt = require('jsonwebtoken')
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const mongoose = require('mongoose')

// connection to the database
mongoose.connect("mongodb://localhost:27017/Delivecrous")

// model 
const dish_schema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const cart_schema = new mongoose.Schema({
    price: Number,
    address: String,
    id: Object,
    dishes: [
        {
            quantity: Number,
            dish: dish_schema
        }
    ]
})

const user_schema = new mongoose.Schema({
    login: String,
    password: String
})

const Dish = mongoose.model("Dish", dish_schema)
const Cart = mongoose.model("Cart", cart_schema)
const User = mongoose.model("User", user_schema)



// authentification with jwt
app.listen(process.env.PORT, () => {
    console.log(`Server Started at http://localhost:${process.env.PORT}`)
})

function generateAccessToken(user){
    return jwt.sign({login: user.login, password: user.password}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
}

function generateRefreshToken(user){
    return jwt.sign({login: user.login, password: user.password}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'})
}
function decodeToken(request, response) {
    const token = request.headers.authorization && extractBearerToken(request.headers.authorization)
    const decoded_token = jwt.decode(token, {complete: false})
    return decoded_token;
}

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

function authenticateToken (request, response, next){
    const token = request.headers.authorization && extractBearerToken(request.headers.authorization)
    if(!token){
        response.status(401).json({message: 'error :('})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
            response.status(401).json({message: 'error :('})
        }
        else{
            return next()
        }
    })
}


// Sign in with login and password
app.post("/sign_in", (request, response) => {
    if (!request.body.login || !request.body.password) {
        return response.status(404).json({message: 'Error: Enter login and password, please  :|'})
    }
    User.findOne({login: request.body.login, password: request.body.password})
        .then(user => {
            return response.json({
                token: generateAccessToken(user)
            })
        }).catch(error => {
        return response.status(401).json({message: 'invalid Credentials :('});
    })
})

// sign up = register
app.post("/sign_up", (request, response)=>{
    if(!request.body.login || !request.body.password){
        return response.status(404).json({message: 'Error: Enter login and password, please  :|'})
    }

    User.findOne({login: request.body.login})
        .then((user) =>{
            if(!user){
                const new_user = new User(request.body)
                new_user.save().then((new_user)=>{
                    response.json(new_user)
                })
            }
            else{
                response.status(403).json({message: 'Error: the user already exists :( Use another for signing up :)'})
            }
        }) 
})


/* the routes*/
// get all the dishes 
app.get('/dishes', (request, response)=>{
    Dish.find().then((dishes)=>{
        return response.json(dishes)
    })
})

// get a dish by id
app.get('/dishes/:id', (request, response)=>{
    Dish.findById(request.params.id)
    .then((dish)=>{
        return response.json(dish)
    })
})

// get all the dishes of a cart 
app.get('/cart', authenticateToken, (request, response)=>{
    const user_decoded = decodeToken(request, response)
    Cart.findOne({id: user_decoded.id}).then((cart)=>{
        return response.json(cart)
    })
})

// add a dish 
app.post('/dishes', authenticateToken, (request, response)=>{
    Dish.findOne({name: request.body.name}).then((dish)=>{
        if(!dish){
            const newDish = new Dish(request.body)
            newDish.save().then((dish)=>{
                return response.json(dish)
            })
        }
        else{
            return response.json({message: 'Error: the dish already exists :('})
        }
    })
})

// add a dish to the cart
app.post("/cart/:id", authenticateToken, (request, response) => {
    const userDecoded = decodeToken(request, response);
    Cart.findOne({id: userDecoded.id})
        .then((cart) => {
            if (!cart) {
                cart = new Cart({price: 0, address: "", id: userDecoded.id, dishes: []})
                return Promise.all([cart.save(), Dish.findById(request.params.id)])
            }
            return Promise.all([cart, Dish.findById(request.params.id)])
        })
        .then(([cart, dish]) => {
            const dishInCart = cart.dishes.find(dishIn => dishIn.dish.id === dish.id)
            if (dishInCart) {
                dishInCart.quantity += 1;
                cart.price += dishInCart.dish.price
            } else {
                cart.price += dish.price;
                cart.dishes.push({quantity: 1, dish: dish})
            }
            cart.save().then((cart) => response.status(201).json(cart))
        }).catch(() => response.status(404).end())
})

// order confirmation 
app.post("/order_confirmation", authenticateToken, (request, response) => {
    const userDecoded = decodeToken(request, response);
    if (!request.body.address) {
        return response.json({message: 'Error: Please enter your address :/'})
    }
    User.findOne({login: userDecoded.login})
        .then((user) => {
            console.log(user)
            return Promise.all([user, Cart.findOne({id: userDecoded.id})])
        })
        .then(([user, cart]) => {
                if (!cart) {
                    return response.status(404).json({message: 'Error: Cart not found :/'})
                }
                cart.save();
                user.address = request.body.address;
                user.save().then((user) => {
                    return response.status(200).json({
                        message: "Order confirmed :) To you, all the best flavors !",
                        cart: cart
                    })
                })
            }
        )
})


// delete a dish 
app.delete('/dishes/:id', authenticateToken, (request, response)=>{
    Dish.findByIdAndRemove(request.params.id)
        .then(()=>{
            return response.json({message: 'Deletion confirmed !'})
        })
})

//delete a dish from the cart
app.delete("/cart/:id", authenticateToken, (request, response) => {
    const userDecoded = decodeToken(request, response);
    Cart.findOne({id: userDecoded})
        .then((cart) => {
            if (!cart) {
                return response.json({message: 'Error: Cart not found :/'});
            }
            return Promise.all([cart, Dish.findById(request.params.id)])
        })
        .then(([cart, dish]) => {
            const dishInCart = cart.dishes.find(dishIn => dishIn.dish.id === dish.id)
            if (dishInCart) {
                dishInCart.quantity -= 1;
                cart.price -= dishInCart.dish.price;
            }
            cart.save().then((cart) =>{
                return response.status(200).json({
                    message: 'Deletion confirmed !',
                    cart: cart
                })
            })
        })
});