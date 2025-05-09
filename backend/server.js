const Express = require("express");
const MySQL = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const PORT = 8081;

// Functions
function fetchQuery(response, database, sql_query) {
    database.query(sql_query, (err, data) => {
        if (err) return response.json(err);
        return response.json(data);
    });
}

function getUserRole(database, user_email, callback) {
    const query = `SELECT u.uemail, da.da_email, vo.vo_email, vi.vi_email,
                CASE
                    WHEN da.da_email IS NOT NULL THEN "admin"
                    WHEN vo.vo_email IS NOT NULL THEN "volunteer"
                    WHEN vi.vi_email IS NOT NULL THEN "victim"
                    ELSE "user"
                END AS role
                FROM USERACCOUNTS u
                LEFT JOIN DEPOTADMINS da ON u.uemail=da.da_email
                LEFT JOIN VOLUNTEERS vo ON u.uemail=vo.vo_email
                LEFT JOIN VICTIMS vi ON u.uemail=vi.vi_email
                WHERE u.uemail = ?;
                `;

    database.query(query, [user_email], (err, data) => {
        if (err) return console.error(err);
        if (data.length === 0) return console.error("no user found at all!");
        
        callback(data[0].role);
    });
}
////////////

// Create MySQL Connection
const DB = MySQL.createConnection({
    host: "localhost",  // Change to appropriate hostname of your MySQL server
    user: "root",       // Change to appropriate user of your MySQL server
    password: "",       // Change to appropriate password of your user
    database: "MaydayManager"   // Remains unchanged
});

// Set up and start local backend server
const App = Express();
App.use(Express.json());
App.use(cors());

// Serve static files from Vite
App.use(Express.static(path.join(__dirname, "../frontend/dist")));

// API Handling
App.post("/api/register", (req, res) => {
    const { email, name, password, role } = req.body;

    console.log(req.body);

    const query = "SELECT * FROM USERACCOUNTS WHERE uemail = ?";
    
    DB.query(query, [email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) return res.status(400).json("User already registered!");

        let encrypted_password = bcrypt.hashSync(password, 10);
        const insert_query = `INSERT INTO USERACCOUNTS(uemail, uname, age, location, street, city, state, passhash)
                            VALUES (?, ?, 0, "", "", "", "", ?)`;
        console.log(email, name, encrypted_password);
        DB.query(insert_query, [email, name, encrypted_password], (err2, data2) => {
            if (err2) return res.status(500).json(err2);
            res.status(201).json("User successfully registered!");
            console.log("Adding to account type now...", role);
            switch(role) {
                case "admin":
                    DB.query("INSERT INTO DEPOTADMINS(da_email) VALUES (?)", [email], (aerr, adata) => {
                        if (aerr) console.error("Admin insert error:", aerr);
                        console.log(`Successfully registered a Depot Admin: ${email}`);
                    });
                    break;
                case "volunteer":
                    DB.query("INSERT INTO VOLUNTEERS(vo_email, signup_date) VALUES (?, CURRENT_DATE)", [email], (verr, vdata) => {
                        if (verr) console.error("Volunteer insert error:", verr);
                        console.log(`Successfully registered a Volunteer: ${email}`);
                    });
                    break;
                case "victim":
                    DB.query("INSERT INTO VICTIMS(vi_email) VALUES (?)", [email], (vierr, vidata) => {
                        if (vierr) console.error("Victim insert error:", vierr);
                        console.log(`Successfully registered a Victim: ${email}`);
                    });
                    break;
            };
        });
    });
});

App.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM USERACCOUNTS WHERE uemail = ?";

    DB.query(query, [username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.json("User not found!");
        
        const user = data[0];
        console.log(data);
        if (bcrypt.compare(password, user.passhash)) {
            console.log(`Successful login by ${username}`);
            
            let new_user = {
                email: user.uemail,
                name: user.uname,
                role: "user"
            };

            getUserRole(DB, new_user.email, role => {
                new_user = {
                    ...new_user,
                    role: role
                };
                res.json(new_user);
            });
        }
        else return res.json("Invalid credentials");
    });
});

App.get("/api/users", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM USERACCOUNTS`);
});

App.get("/api/victims", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM VICTIMS vi
                        LEFT JOIN RELIEFREQUEST rf
                        ON vi.vi_email=rf.vi_email
                        LEFT JOIN USERACCOUNTS u
                        ON vi.vi_email=u.uemail`);
});

App.get("/api/volunteers", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM VOLUNTEERS vo
                        LEFT JOIN SKILLS s ON vo.vo_email=s.vo_email
                        LEFT JOIN USERACCOUNTS u ON vo.vo_email=u.uemail`);
});

App.get("/api/depotadmins", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM DEPOTADMINS da
                            LEFT JOIN USERACCOUNTS u
                            ON da.da_email=u.uemail`);
});

App.get("/api/products", (req, res) => {
    fetchQuery(res, DB, "SELECT * FROM PRODUCT ORDER BY itemID" );
});

App.get("/api/vehicles", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM VEHICLES
                        ORDER BY itemID`);
});

App.get("/api/utilities", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM UTILITIES ut
                        LEFT JOIN PRODUCT p
                        ON ut.itemID=p.itemID
                        ORDER BY itemID`);
});

App.get("/api/medicalaid", (req, res) => {
    fetchQuery(res, DB, `SELECT * FROM MEDICALAID m
                        LEFT JOIN PRODUCT p
                        ON m.itemID=p.itemID
                        LEFT JOIN DIAGNOSE_TREATS dt
                        ON m.itemID=dt.itemID
                        ORDER BY itemID`)
});

App.get("/api/food_water", (req, res) => {
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

// URLS not handled by Express will be directed to Vite React's
// index.html file
App.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname + "../frontend/dist/index.html"));
});

App.listen(PORT, (res, req) => {
    console.log(`Listening on ${PORT}...`);
});
