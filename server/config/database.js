const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Ensure SRV records for MongoDB Atlas resolve reliably on all networks/ISPs
dns.setServers(["8.8.8.8", "8.8.4.4"]);

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    });
};
