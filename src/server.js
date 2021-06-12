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


app.use(routes);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

