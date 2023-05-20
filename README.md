# Transcendence

> This is it folks. After several months, this is end of the road for the space cadet. I'm not going to be working on this project anymore. I'm not going to be working on any project anymore. I'm not going to be working anymore. I'm not going to be anymore. I'm not going to be. I'm not going. I'm not. I'm. I. . . .

## What is this?

Transcendence is the final project of the common core to be made by a 42 student. It consists in a web application running a multiplayer online game, a chat and a user profile system. The game is a multiplayer version of the classic game Pong, where players can join a room and play against each other. The chat is a global chat where all users can talk to each other, or if they want it, they may send direct messages to other users. The user profile system allows users to create an account, log in and out, and change their password. The project is made using the following technologies:

- [NestJS](https://nestjs.com/) as the backend framework;
- [React](https://reactjs.org/) as the frontend framework;
- [TypeScript](https://www.typescriptlang.org/) as the programming language;
- [PostgreSQL](https://www.postgresql.org/) as main relational database;
- [TypeORM](https://typeorm.io/) as the ORM;
- [Socket.IO](https://socket.io/) for real-time communication;
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for the containerization;

## How to run it?

### With Docker and Docker Compose

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/);

2. Clone this repository and cd into the project's root directory:

```bash
git clone git@github.com:AdrianWR/transcendence.git
cd transcendence
```

3. Create a `.env` file in the project's root directory and fill it with the following environment variables:

```bash
# .env

# For database connection
POSTGRES_USER=      # PostgreSQL username
POSTGRES_PASSWORD=  # PostgreSQL password
POSTGRES_DB=        # PostgreSQL database name

# For Google OAuth 2.0 authentication
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
GOOGLE_REDIRECT_URL=

# For 42 Intra OAuth 2.0 authentication
INTRA_CLIENT_ID=
INTRA_SECRET=
INTRA_REDIRECT_URL=

# For JWT authentication (you may use random strings)
JWT_ACCESS_SECRET=    # JWT access token secret
JWT_REFRESH_SECRET=   # JWT refresh token secret

# Path where user pictures will be stored
USER_PICTURE_PATH=
```

4. Run the following command:

```bash
docker-compose up --build
```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000).

The environment variables required are the ones explicilty required for the project to be run. However, there are other environment variables that can be set to change the behavior of the application. For a complete list of the environment variables, check the [`.env.example`](./.env.example) file.

### Local Development

You may find specific instructions for local development in the [`README.md`](./backend/README.md) file in the [`backend`](./backend) directory and in the [`README.md`](./frontend/README.md) file in the [`frontend`](./frontend) directory.

In any case, you will need to have [Node.js](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/) installed in your machine. If you want, however, to use the PostgreSQL database in a Docker container, you may declare the PostgreSQL environment variables in a `.env` file in the project's root directory and run the following command:

```bash
docker-compose up -d postgres
```

## How to play?

### Create an account and log in

To create an account, you must go to the [sign up page](http://localhost:3000/signup) and fill the form with your information. If you want to log in to an existing user account, just go to the [log in page](http://localhost:3000/login) and fill the form with your credentials.

You may also log in using your Google or 42 Intra account by clicking on the respective button. You will be presented with a consent screen where you must allow the application to access your information. After that, you will be redirected to the application as a logged in user.

![Sign In Page](./assets/signin.png 'Sign In Page')

### Playing the game

Click on the "Play" button on the top right corner of the page to be redirected to the game page. You will be presented with a list of rooms. You may join an existing room by clicking on the "Join a random game room" button, or you may create a new room by clicking on the "Create a new game room" button.

Choosing either option, you will be redirected to the game page. If you are the first player to join the room, you will be presented with a waiting screen until another player joins the room. If you are the second player to join the room, the game will start immediately.

![Game Page](./assets/game.png 'Game Page')

### Chatting

You may chat with other users in the global chat. To do so, click on the "Chat" button on the top right corner of the page. Here, click the "+" (plus) button, and you will be presented to several options:

- **Create Group Chat:** Create a new group chat. You will be asked to give a name to the group chat and to select its type (public, private or protected). If you choose the protected type, you will be asked to give a password to the group chat.

- **Direct Message:** Send a direct message to another user. You will be asked to select the user you want to send the message to.

- **Join Group Chat:** Join an existing group chat. You will be asked to select the group chat you want to join.

![Create Chat Modal](./assets/create_chat.png 'Create Chat Modal')

The chat page shows the list of all your chats on the sidebar. Click on a chat to open it. The chat messages will be shown on the main area of the page, and you may send a message by typing it in the input field, followed by typing the "Enter" key.

If you are chatting in a direct message, you may invite a user to a game by pressing the "Invite to Game" button. The user will receive the game URL in the chat, and if they click on it, they will be redirected to the game page.

![Chat Page](./assets/chat.png 'Chat Page')

### User Profile

You may access your user profile by clicking on the "Profile" button on the top right corner of the page. Here, you have access to your user information, your friends list, your game history and your game statistics.

![Profile Page](./assets/profile.png 'Profile Page')

You may change your user information clicking on the "Edit Profile" button. Besides being able to change common user information (such as username, email and password), you may also change your user picture by clicking on the "Change Picture" button, and enabling or disabling the two-factor authentication by clicking on the "Enable 2FA" switch button.

Your "Friends List" shows all your friends. You may add a new friend by clicking on the "Add a new Friend" button and selecting the user you want to add. Check the "Friend Requests" tab to see all the friend requests you have received. You may accept or decline a friend request by clicking on the respective button.

Your "Match History" section shows all the games you have played, while your "User Stats" section shows your game statistics. Check your game achievements by clicking on the small trophy button on this section!
