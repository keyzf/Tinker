<div style="display: flex;justify-content: center;">
  <br />
  <p>
    <img src="https://github.com/LordFarquhar/DevsApp/blob/master/res/devsbot500x500.png?raw=true" width="125" height="125"/>
  </p>
  <br />
  <p>
    <a href="https://discord.io/joinDevs"><img src="https://discord.com/api/guilds/711189052371501107/widget.png?style=banner3" alt="Discord server" /></a>
  </p>
</div>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/313bb7e106b84a9aad93d464808903fb)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=LordFarquhar/DevsApp&amp;utm_campaign=Badge_Grade)

## Table of contents

- [About](#about)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuring](#configure-app)
- [Contributing](#contributing)
- [Help](#help)

## Links

- [GitHub](https://github.com/LordFarquhar/DevsApp/)

# DevsApp

## About

A nice project with a nice description

---
## Requirements

For development, you will only need Node.js installed in your environement.
For production you will also need pm2 installed globally

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.18
    
    $ npm --version
    6.14.5
    (but its probably better to have the latest version)

If you need to update `npm`, you can make it using `npm`! Cool right? Just run the following command

    $ npm install npm -g

### pm2
- #### pm2 installation on windows with npm installed

  You can install pm2 easily with npm install, just run the following commands:

      npm install -g pm2
      
  To update pm2 do:
  
      npm install -g pm2
      pm2 update

- #### pm2 installation on linux with npm installed

  You can install pm2 easily with npm install, just run the following commands:
    
      $ sudo npm install -g pm2
      
  To update pm2 do:
  
      $ sudo npm install -g pm2
      $ pm2 update

## Installation

    $ git clone https://github.com/LordFarquhar/DevsApp
    $ cd DevsApp
    $ npm install

## Configure app

Create a file in the root directy (in the same folder as index.js) named .env
 - add `BOT_TOKEN=your_token_here`
 - add `MONGO_RUL=your_mongodb_access_url_here`
 - optionally add `PORT=dashboard_server_port`

Then open `./config/config.json` then edit it with your settings. You will need:

- your userId
- optionally the bug reports and feature requests channel of your Bot server

## Running the project during developmnet

    $ npm run dev

## Running the project during production (for this you will need pm2)

    $ npm start
 
## Contributing

At the moment we are not allowing contributions to this project however, we are hoping to change that soon

## Help

If your stuck feel free to contact us in our (Official Support server)[https://discord.com/aymBcRP]
