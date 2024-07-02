const express = require("express");
const connectDB = require("./server/database/connection");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: ".env" });
// const bodyParser = require("body-parser");

var cors = require("cors");

const app = express();
// app.use(require('cors')());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(cors());

const PORT = process.env.PORT;

// app.use(bodyParser.urlencoded({extended : false}))

connectDB();

app.use("/api", require("./server/routes/userRouter"));
// app.use('/api/friend', require('./server/routes/friendsRoutes'))
app.listen(PORT, () => {
	console.log(`listing on port  localhost:${PORT}`);
});
