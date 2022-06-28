### To check description and technologies go to https://github.com/Vinicius-R-Cunha/barber_rafa-front-end

## How to run

### Clone this repository

```bash
$ git clone https://github.com/Vinicius-R-Cunha/barber_rafa-back-end.git
```

### Access the directory where you cloned it

```bash
$ cd barber_rafa-back-end
```

### Install back-end dependencies

```bash
npm i
```

### Create an environment variables file in the project root (.env) and configure it as shown in .env.example file:

```bash
ADMIN_EMAIL=youradminemail@gmail.com
SEND_MESSAGES_EMAIL=email@gmail.com
SEND_MESSAGES_APP_PASSWORD=gmail app password
FRONTEND_URL=http://localhost:3000/
DATABASE_NAME=barber-rafa
JWT_SECRET=yourSecretKey
MONGO_URI=mongodb://localhost/:27017/
CLIENT_ID=get this from your Google Oauth Credentials
CLIENT_SECRET=get this from your Google Oauth Credentials
REFRESH_TOKEN=get this from your Google Oauth Credentials
PORT=optional
```

### Run the back-end with

```bash
npm start
```

### Clone and follow the instructions for the front-end repository at https://github.com/Vinicius-R-Cunha/barber_rafa-front-end
