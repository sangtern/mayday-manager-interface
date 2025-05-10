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

// API Handling
App.post("/register", (req, res) => {
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

App.post("/login", (req, res) => {
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
                console.log(`${username}'s new role: ${role}`);
            });
        }
        else return res.json("Invalid credentials");
    });
});

App.get("/reliefrequests/:role/:email", (req, res) => {
    const { role, email } = req.params;

    switch(role) {
        case "victim":
            fetchQuery(res, DB, `SELECT * FROM VictimReliefRequests WHERE vi_email = '${email}'`);
            break;
        case "volunteer":
            fetchQuery(res, DB, "SELECT * FROM VolunteerReliefRequests");
            break;
        case "admin":
            fetchQuery(res, DB, "SELECT * FROM AdminReliefRequests");
            break;
    };
});

App.get("/products/:role/:email", (req, res) => {
    const { role } = req.params;

    switch(role) {
        case "volunteer":
            fetchQuery(res, DB, "SELECT * FROM VolunteerProducts");
            break;
        case "admin":
            fetchQuery(res, DB, "SELECT * FROM AdminProducts");
            break;
    };
});

App.get("/depots/:role/:email", (req, res) => {
    const { role } = req.params;

    if (!role === "admin") return res.json("Invalid permission");

    fetchQuery(res, DB, "SELECT * FROM AdminDepots");
});

App.get("/volunteers/:role/:email", (req, res) => {
    const { role } = req.params;

    if (!role === "admin") return res.json("Invalid permission");

    fetchQuery(res, DB, "SELECT * FROM AdminVolunteers");
});

App.get("/victims/:role/:email", (req, res) => {
    const { role } = req.params;

    if (!role === "admin") return res.json("Invalid permission");

    fetchQuery(res, DB, "SELECT * FROM AdminVictims");
});

// Serve static files from Vite
App.use(Express.static(path.join(__dirname, "../frontend/dist")));

App.listen(PORT, (res, req) => {
    console.log(`Listening on ${PORT}...`);
});
