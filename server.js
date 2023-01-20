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
    user_id: Object,
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



// authentification
console.log("secret is ", process.env.ACCESS_TOKEN_SECRET)

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


const user = new User({
    login: 'pape',
    password: 'abc'
})

//user.save()
//const accessToken = generateAccessToken(user)






/* POST: sign in with your login and password  */
app.post("/login", (request, response) => {
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

/* POST: register a new user  */
app.post("/signup", (request, response)=>{
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


// Les routes
// get all the dishes 
app.get('/dishes', (request, response)=>{
    Dish.find().then((dishes)=>response.json(dishes))
})

//get a dish by id
app.get('/dishes/:id', (request, response)=>{
    Dish.findById(request.params.id)
    .then((dish)=>{
        response.json(dish)
    })
})

// get all the dishes of a cart 
app.get('/cart', authenticateToken, (request, response)=>{
    const user_decoded = decodeToken(request, response)
    Cart.findOne({id: user_decoded.id}).then((cart)=>{
        response.json(cart)
    })
})

// add a dish to the cart
app.post('/cart', authenticateToken, (request, response)=>{
    const user_decoded = decodeToken(request, response)
    Cart.findOne({id: user_decoded.id}).then((cart)=>{
        response.json(cart)
    })
})

// command confirmation
app.post('/cart/', authenticateToken, (request, response)=>{
    const user_decoded = decodeToken(request, response)
    Cart.findOne({id: user_decoded.id}).then((cart)=>{
        response.json(cart)


    })
})

// delete a dish 
app.delete('/dishes/:id', authenticateToken, (request, response)=>{
    Dish.findByIdAndRemove(requet.params.id)
        .then(()=>response.json({message: 'Deletion confirmed !'}))
})

//delete a dish from the cart
app.delete('/cart/:id', authenticateToken, (request, response)=>{
    const user_decoded = decodeToken(request, response)
    Cart.findOne({id: user_decoded.id}).then((cart)=>{
        if(!cart){
            return response.json({message: 'Error! Cart not found.'})
        }
        //cart.findByIdAndRemove(request.params.id)
        //    .then(()=>response.json({message: 'Deletion confirmed !'}))
        const dish_in = cart.dishes.findById(request.params.id)
        if (dish_in){
            if(dishes.quantitity >= 0){
                dishes.quantity -= 1
            }
            else{
                dishes.findByIdAndRemove(requet.params.id)
            }
            cart.price -= dish_in.price   
        }
        cart.update()
    })
})
