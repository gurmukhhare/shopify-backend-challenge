const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');

const db = {
	inventory: [
	{
		id: 0,
		name: "item1",
		stock: 5,
		description: "sample description for item 1"

	},
	{
		id: 1,
		name: "item2",
		stock: 5,
		description: "sample description for item 2"

	},
	{
		id: 2,
		name: "item3",
		stock: 5,
		description: "sample description for item 3"

	}
	]
}


router.get('/', (req,res)=>{
	res.json('inventory route is working');
})

router.get('/view/:itemId?', (req,res)=>{
	if(req.params.itemId){
		const length = db.inventory.length;
		let currItem = null;
		for(let i=0; i<length; i++){
			if(db.inventory[i].id == req.params.itemId){
				currItem = db.inventory[i];
				break;
			}
		}
		let result = (!currItem) ? res.status(400).json('invalid item, currently not in our inventory') : res.status(200).json(currItem);
		return result;

	} else{
		return res.json(db.inventory);
	}

})

router.post('/create-item', [
	check('name', 'Name field is required').not().isEmpty(),
	check('description', 'description field is required').not().isEmpty(),
	check('stock', 'stock field is required').not().isEmpty(),
	check('stock', 'stock amount must be between the min and max allowed').isInt({min:0, max:10})
	],(req,res)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			res.status(400).json("ERROR: invalid information entered for new inventory item");
		} else{
			//add the item to the db
		}

})

router.delete('/delete-item/:itemId',
	check('itemId', "Item's ID field is required and must be a valid integer value").not().isEmpty().isInt(), 
	(req,res)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()) res.status(400).json("ERROR: must provide a valid integer item ID");
		else{
			//try to remove the item from the db, if not found return an error
		}
})

router.put('/edit-item/:itemId',
	check('itemId', "Item's ID field is required and must be a valid integer value").not().isEmpty().isInt(),
	(req,res)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()) res.status(400).json("ERROR: must provide a valid integer item ID");
		else{
			//try to retreive record from db and update it. If not found, create a new record with the provided data
		}

})


module.exports = router;