const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');

router.get('/', (req,res)=>{
	res.json('inventory route is working');
})

router.post('/create-warehouse', (req,res)=>{
	
})