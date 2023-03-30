
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
// app.post('/', (req, res) => {
//     res.json('got to serv')
// })

const usersRoute = require("./routes/users")
const experimentRoute = require("./routes/experiment");
const actionsRoute = require("./routes/action");
const calibrationRoute = require("./routes/calibration");
const soositoryRoute = require("./routes/soository");
app.use('/users', usersRoute);
app.use('/experiment', experimentRoute);
app.use('/actions', actionsRoute);
app.use('/calibration', calibrationRoute);
app.use('/soository', soositoryRoute);

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
}
);