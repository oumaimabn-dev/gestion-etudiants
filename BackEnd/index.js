const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require('dotenv').config();

const userRoute = require("./routes/userRoutes");
const enseignantRoutes = require("./routes/enseignantRoutes");
const connectDB = require("./config/connexionDB");
const etablissementRoutes = require('./routes/etablissementRoutes');
const surveillanceRoutes = require('./routes/surveillanceRoutes');
const directorSurveillanceRoutes = require("./routes/surveillanceDirector");

connectDB();
app.use(cors());
app.use(express.json());



app.use('/api/surveillances', surveillanceRoutes);
app.use("/api/users", userRoute);
app.use("/api/enseignants", enseignantRoutes);
app.use('/api/etablissements', etablissementRoutes);
app.use("/api/surveillances/director", directorSurveillanceRoutes);  

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
