# NEST_BACKEND_SHOP(IN PROGRESS)

## Installation

**You need to have node.js, npm, TypeScript, and NestJS installed.**

1. Install PostgreSQL (you may also want to install pgAdmin4 for monitoring tables).

2. Clone the repository:

```bash
$ git clone https://github.com/VizitiuVitalie/nest_backend_shop
$ cd nest_backend_shop
```

3. Install dependencies:

```bash
$ npm install
```

4. Create a .env file in the root of the project and add the necessary environment variables:

```makefile
PORT=1111
DB_NAME=db_name
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
ACCESS_SECRET_KEY=access_key
REFRESH_SECRET_KEY=access_key
```

**Here you should set your username, password, and port that you used when configuring PostgreSQL (default is postgres, postgres, 5432).**

5. Connect to PostgreSQL:

```bash
$ psql -U postgres
```

6. Enter the commands from src/database/database.sql (enter the CREATE TABLE users command in full).

## Running

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Features

1. Install an HTTP client, such as Postman.

2. Create a POST request to the URL http://localhost:1111/user/register.

3. Select Body, then raw.

4. Paste the following JSON object into raw for registration and send the request:

```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123",
    "name": "example",
    "sessions": {},
    "contact": {
      "phoneNumber": "123123",
      "whatsappNumber": "123123",
      "telegramUsername": "username"
    },
    "address": {
      "city": "city",
      "street": "street",
      "house": "house"
    }
  },
  "session_source": "chrome"
}
```

5. You will receive a registered user with status code 200, a message about successful registration, and the user data.
