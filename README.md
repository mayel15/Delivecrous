# Delivecrous

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
| `POST`      | `/cart/{id}` | Add a dish to the cart  |
| `POST`      | `/order_confirmation` | For confirming an order  |
| `DELETE`      | `/dishes/{id}` | Delete a dish from the collection  |
| `DELETE`      | `/cart/{id}` | Delete a dish from the cart |
