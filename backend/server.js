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
    fetchQuery(res, DB, `SELECT * FROM USERACCOUNTS`);
});

App.get("/victims", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM VICTIMS vi
                        LEFT JOIN RELIEFREQUEST rf
                        ON vi.vi_email=rf.vi_email
                        LEFT JOIN USERACCOUNTS u
                        ON vi.vi_email=u.uemail`);
});

App.get("/volunteers", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM VOLUNTEERS vo
                        LEFT JOIN SKILLS s ON vo.vo_email=s.vo_email
                        LEFT JOIN USERACCOUNTS u ON vo.vo_email=u.uemail`);
});

App.get("/depotadmins", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM DEPOTADMINS da
                            LEFT JOIN USERACCOUNTS u
                            ON da.da_email=u.uemail`);
});

App.get("/products", (req, res) => {
    fetchQuery(res, DB, "SELECT * FROM PRODUCT ORDER BY itemID" );
});

App.get("/vehicles", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM VEHICLES
                        ORDER BY itemID`);
});

App.get("/utilities", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM UTILITIES ut
                        LEFT JOIN PRODUCT p
                        ON ut.itemID=p.itemID
                        ORDER BY itemID`);
});

App.get("/medicalaid", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM MEDICALAID m
                        LEFT JOIN PRODUCT p
                        ON m.itemID=p.itemID
                        LEFT JOIN DIAGNOSE_TREATS dt
                        ON m.itemID=dt.itemID
                        ORDER BY itemID`)
});

App.get("/food_water", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM FOOD_WATER fw
                        LEFT JOIN PRODUCT p
                        ON fw.itemID=p.itemID
                        ORDER BY itemID`);
});

/* ORGANIZATIONDEPOT
    * FUNDINGSOURCE
    * RELIEFINVENTORY
    * SUPPLIER
    * DISASTEREVENT
    * CITIESAFFECTED
    * PAYS
    * DELIVERY
    * SELFENROLL
    * TASKEDAT
    * DRIVER
    * RECRUIT
    * SUPERVISE
    * AFFECTED
    * MAKES
    * MANAGES
    * ORDERS
    * REQUESTS
    * SELLS
    * RECEIVEFROMSUPPLIER
    * INVENTORYTRANSFER
    * DROPOFF
    * CANUSE
    */

App.listen(8081, (res, req) => {
    console.log("Listening on 8081...");
});
