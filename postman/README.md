# Postman collection for Order Supply GraphQL API

## Import

1. Open Postman.
2. **Import** → **File** → select `order-supply-graphql.postman_collection.json`.
3. The collection **Order Supply GraphQL API** will appear in your sidebar.

## Variables

- **baseUrl** – default `http://localhost:4000`. Change if your server runs on another host/port.
- **access_token** – leave empty at first. After running **Auth → Login**, copy the `access_token` from the response and paste it into the collection variables (click the collection → Variables tab) so requests marked **[Auth]** use it.

## Requests

| Folder / Request | Auth | Description |
|------------------|------|-------------|
| Health | No | `hello` – health check |
| Auth → Register | No | Create a new user; returns `access_token` and `user` |
| Auth → Login | No | Get `access_token` for an existing user |
| Users → Users (list) | No | List all users |
| Users → User (single) [Auth] | Yes | Get one user by ID (set variable `id` or edit body) |
| Users → Users with orders | No | Users and their orders (nested) |
| Products → Products (list) | No | List all products |
| Products → Product (single) | No | Get one product by ID |
| Orders → Orders (list) [Auth] | Yes | List all orders |
| Orders → Order (single) [Auth] | Yes | One order with `user` and `products` (set `id` in variables) |
| Orders → Orders with user and products [Auth] | Yes | All orders with nested user and products |
| All in one (public) | No | `hello`, `users`, `products` in one query |

## Tips

- Replace `USER_ID_HERE`, `PRODUCT_ID_HERE`, `ORDER_ID_HERE` in the request body (or use collection/environment variables) with real IDs from list responses.
- For **[Auth]** requests, set **Authorization** to `Bearer {{access_token}}` and ensure `access_token` is set after login.
