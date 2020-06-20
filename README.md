<div align="center">
  <br />
  <p>
    <a href=""><img src="project img" width="546" alt="DevsApp Logo" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.io/joinDevs"><img src="https://discord.com/api/guilds/GUILD_ID/embed.png" alt="Discord server" /></a>
  </p>
</div>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/313bb7e106b84a9aad93d464808903fb)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=LordFarquhar/DevsApp&amp;utm_campaign=Badge_Grade)

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Example Usage](#example-usage)
- [Links](#links)
  - [Extensions](#extensions)
- [Contributing](#contributing)
- [Help](#help)

## Links

- [GitHub](https://github.com/)

# DevsApp

A nice project with a nice description

---
## Requirements

For development, you will only need Node.js installed in your environement.

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
    v13

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


## Install

    $ git clone https://github.com/LordFarquhar/DevsApp
    $ cd DevsApp
    $ npm install

## Configure app

Open `./config/config.json` then edit it with your settings. You will need:

- A setting;
- Another setting;
- One more setting;

## Running the project during developmnet

    $ npm run dev

## Running the project during production (for this you will need pm2)

    $ npm start

