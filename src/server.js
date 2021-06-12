const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const routes = require("./routes");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    console.log("MongoDB connected");
} catch (error) {
    console.log(error);
}

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}
app.use(routes);
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

