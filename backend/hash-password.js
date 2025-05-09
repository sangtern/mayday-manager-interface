const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
    console.error("Please provide a password: npm run hash your-password");
    process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
    console.log(`Hashed password for '${password}':\t${hash}`);
});
