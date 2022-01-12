const express = require('express');
const router = express.Router();
const knex = require ('knex');
const { check,validationResult } = require('express-validator');

//postgres database configuration
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'gurmukhhare',
    password : '',
    database : 'shopify-backend-db'
  }
});

router.get('/', (req,res)=>{
	res.json('inventory route is working');
})

/**
* Endpoint to retrieve a list of inventory items or a specific item based on itemId
* @Params: itemId (OPTIONAL)
* @return: retrieved item or array of items if successful, otherwise returns error codes/messages if item cannot be found or retrieved
*/
router.get('/view/:itemId?', (req,res)=>{
	if(req.params.itemId){
    const id  = req.params.itemId;
    db.select('*')
    .from('inventory')
    .where({
      id: id
    }).then(item=>{
      if(item.length) {
        res.status(200).json(item[0]);
      }
      else {
        res.status(404).json("ERROR: item with the provided ID not found in inventory");
      }
    }).catch(err=> {
      res.status(400).json("ERROR: could not retrieve item");
      console.log(err);
    })

	} else{
		db.select('*')
    .from('inventory')
    .then(items=>{
      res.status(200).json(items);
    }).catch(err => {
      res.status(400).json("ERROR: could not fetch inventory items");
      console.log(err);
    })
	}

})

/**
* Endpoint to create new inventory item
* @Params: name, description, stock, warehouseId(OPTIONAL, part of additional feature to assign items to specifc warehouses)
* @return: created item object if successful, otherwise returns error codes/messages if item is duplicate, invalid input, etc
*/
router.post('/create-item', [
	check('name', 'Name field is required').not().isEmpty(),
	check('description', 'description field is required').not().isEmpty(),
	check('stock', 'stock field is required').not().isEmpty(),
	check('stock', 'stock amount must be between the min and max allowed').isInt({min:0, max:10})
	],(req,res)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			res.status(400).json("ERROR: invalid information entered for new inventory item");
		} 
    else{
      const { name, description, stock, warehouseId } = req.body;
      if(warehouseId){
        db.select('*')
        .from('warehouses')
        .where({
          id: warehouseId
        }).then(result=>{
          if(!result.length){
            res.status(404).json("ERROR: invalid warehouseId provided, warehouse does not exist");
          } else{
            db('inventory')
            .returning('*')
            .insert({
              name: name,
              stock: stock,
              description: description,
              warehouseid: warehouseId
            }).then(item=>{
              res.status(201).json(item[0]);
            }).catch(err=>{
              res.status(409).json("ERROR: failed to add item to specified warehouse's inventory");
              console.log(err);
            })
          }
        })
      } else{
        db('inventory')
        .returning('*')
        .insert({
          name: name,
          stock: stock,
          description: description,
        }).then(item=>{
          res.status(201).json(item[0]);
        }).catch(err=>{
          res.status(409).json("ERROR: failed to add item to main warehouse inventory");
          console.log(err);
        })

      }
		}
})

/**
* Endpoint to delete an inventory item
* @Params: itemId
* @return: deleted item object if successful, otherwise returns error codes/messages if item cannot be removed or not found
*/
router.delete('/delete-item/:itemId',
	check('itemId', "Item's ID field is required and must be a valid integer value").not().isEmpty().isInt(), 
	(req,res)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
      res.status(400).json("ERROR: must provide a valid integer item ID");
    }
		else{
			//try to remove the item from the db, if not found return an error
      const id = req.params.itemId;
      db('inventory')
      .returning('*')
      .del()
      .where({
        id: id
      }).then(item=>{
        if(item.length) {
          res.status(200).json(item[0]);
        }
        else {
          res.status(404).json("specified item not found in inventory");
        }
      }).catch(err=>{
        res.status(400).json("ERROR: item with specified ID could not be removed");
        console.log(err);
      })
		}
})

/**
* Endpoint to edit an inventory item if exists or create new resource
* @Params: itemId, name, description, stock
* @return: updated/created item object if successful, otherwise returns error codes/messages if item cannot be updated or created
*/
router.put('/edit-item/:itemId',
  [
	check('itemId', "Item's ID field is required and must be a valid integer value").not().isEmpty().isInt(),
  check('name', 'Name field is required').not().isEmpty(),
  check('description', 'description field is required').not().isEmpty(),
  check('stock', 'stock field is required').not().isEmpty(),
  check('stock', 'stock amount must be between the min and max allowed').isInt({min:0, max:10})
  ],
	(req,res)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
      res.status(400).json("ERROR: must provide a valid integer item ID and item details");
    }
		else{
      const id = req.params.itemId;
      const { name, description, stock } = req.body;
      db.select('*')
      .from('inventory').where({
        id: id
      }).then(item=>{
        if(item.length) {
          db('inventory')
          .returning('*')
          .update({ name,description,stock })
          .where({id})
          .then(item=>{
            res.status(200).json(item[0]);
          }).catch(err=> {
            res.status(400).json("ERROR: could not update inventory item");
            console.log(err);
          })
        } else {
          db('inventory')
          .returning('*')
          .insert({
            name: name,
            stock: stock,
            description: description
          }).then(item=>{
            res.status(201).json(item[0]);
          }).catch(err=>{
            res.status(400).json("ERROR: item could not be added to inventory");
            console.log(err);
          })
        }
      })
		}

})

module.exports = router;