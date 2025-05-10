# Web Interface for Mayday Manager

## Requirements

* MySQL Server ([Installation Guide](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/))
    * Ensure you have a working MySQL server running on your device.
    * Please open `project_root/backend/server.js`, locate `MySQL.createConnection` change the `user` and `password` accordingly to how you set up your MySQL server.
        * By default, a passwordless root user is assumed to be set up
* Node.js ([Download Page](https://nodejs.org/en))
    * Ensure you have Node.js installed by running `npm --version` or `node --version` in your terminal
    * If you do not have it installed, click on the `Download Page` to download and install Node.js on your device

## Installation

1. Click on the green `Code` button located above the box of listed project files
2. Click on the `Download ZIP` button to download the project file
3. Extract the ZIP archive to a location you have access to
4. Open a terminal and change directory (`cd`) into the project folder
5. `cd` again into `backend/` located inside the project folder
6. Run `npm run build` and wait for the build to finish
7. After building the web app, run `npm start` to start the web app
    * You can stop the web app anytime by pressing:
        * Non macOS users: Ctrl and C keys
        * macOS users: Cmd and C keys

You can access the web app by entering the following URL into your web browser: `http://localhost:8081/`
