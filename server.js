const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

const inventoryRoutes = require('./routes/inventory');
const warehouseRoutes = require('./routes/warehouse');

const app = express();

//middleware 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//forward requests to appropriate router
app.use('/inventory', inventoryRoutes);
app.use('/warehouse', warehouseRoutes);

app.listen(3000, ()=>{
  console.log("app is running");
})

module.exports = app;