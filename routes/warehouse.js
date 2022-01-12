const express = require('express');
const router = express.Router();
const knex = require ('knex');
const { check,validationResult } = require('express-validator');

//postgres database config
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

/**
* Endpoint to view a list of existing warehouses or the inventory in a specific warehouse based on provided warehouseId
* @Params: warehouseId (OPTIONAL)
* @return: array of warehouse objects or an array of items in a specific warehouse if successful, otherwise returns appropriate error code/message
*/
router.get('/:warehouseId?', (req,res)=>{
  if(req.params.warehouseId){
    const warehouseId  = req.params.warehouseId;
    db.select('*')
    .from('warehouses')
    .where({
      id: warehouseId
    }).then(result=>{
      if(!result.length){
        res.status(404).json("ERROR: warehouse with provided ID does not exist")
      } 
      else{
        db.select('*')
        .from('inventory')
        .where({
          warehouseid: warehouseId
        }).then(items=>{
          res.status(200).json(items);
        }).catch(err=> {
          res.status(400).json("ERROR: could not fetch items for specified warehouse");
          console.log(err);
        })
      }
    })
  } 
  else{
    db.select('*')
    .from('warehouses')
    .then(warehouses=>{
      res.status(200).json(warehouses);
    }).catch(err => {
      res.status(400).json("ERROR: could not fetch warehouses");
      console.log(err);
    })
  }

})

/**
* Endpoint to create new warehouse location
* @Params: name, location
* @return: created warehouse object if successful, otherwise returns appropriate error code/message
*/
router.post('', [
  check('name', 'Name field is required').not().isEmpty(),
  check('location', 'location field is required').not().isEmpty(),
  ],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json("ERROR: invalid information entered for new warehouse");
    } 
    else{
      const { name, location } = req.body;
      db('warehouses')
      .returning('*')
      .insert({
        name: name,
        location: location
      }).then(result=>{
        res.status(201).json(result[0]);
      }).catch(err=>{
        res.status(409).json("ERROR: failed to create warehouse");
        console.log(err);
      })
    }

  })

module.exports = router;