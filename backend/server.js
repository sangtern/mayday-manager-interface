const Express = require("express");
const MySQL = require("mysql2");
const cors = require("cors");

// Functions

function fetchQuery(response, database, sql_query) {
    database.query(sql_query, (err, data) => {
        if (err) return response.json(err);
        return response.json(data);
    });
}

////////////

// Create MySQL Connection
const DB = MySQL.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "MaydayManager"
});

// Set up and start local backend server
const App = Express();
App.use(cors());

App.get("/", (req, res) => {
    res.send("Hello World");
});

App.get("/users", (req, res) => {
    console.log("Useraccounts fetched");
    fetchQuery( res, DB, "SELECT * FROM USERACCOUNTS" );
});

App.get("/products", (req, res) => {
    fetchQuery( res, DB, "SELECT * FROM PRODUCT" );
});

App.listen(8081, (res, req) => {
    console.log("Listening on 8081...");
});
