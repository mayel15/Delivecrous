# Delivecrous

## Installation
Make sure `npm`, `git`, `MongoDB` are installed. 

Clone the project 
```bash
  git clone https://github.com/mayel15/Delivecrous.git
```

Install the necessary dependencies 
```bash
  cd Delivecrous
```
```bash
  npm install express
  npm install nodemon 
  npm install mongoose
  npm install body-parser
  npm install jsonwebtoken
  npm install dotenv
  npm install cors
```

## API 
Only `GET /`, `GET /dishes`, `GET /dishes/{id}`, `POST /login` and `POST /sign_up` don't need account to access. 

| Method | Endpoints     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `GET`      | `/` | Get the Welcome Message :-) |
| `GET`      | `/dishes` | Get all the dishes |
| `GET`      | `/dishes/{id}` | Get a particular dish by id |
| `GET`      | `/cart` | Get the the dishes of a cart |
| `POST`      | `/login` | Sign in with login and password |
| `POST`      | `/sign_up` | Sign up with login and password |
| `POST`      | `/dishes` | Add a new dish to the collection |
| `POST`      | `/cart/{id}` | Add a dish to the cart by its id  |
| `POST`      | `/order_confirmation` | For confirming an order  |
| `DELETE`      | `/dishes/{id}` | Delete a dish from the collection by its id |
| `DELETE`      | `/cart/{id}` | Delete a dish from the cart by its id |

## Postman API test
You can find the Delivecrous collection in the file named : `Delicrous API - Pape THIAM.postman_collection`.

For using token, you need to:
- Login on `POST /login` using login and password 
- Copy the token and paste it on `Baerer Token Authorization`


