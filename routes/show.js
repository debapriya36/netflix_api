const express=require('express');
const router=express.Router();
const { seedData, resetData, getData} = require('./../controllers/netflix.controller')

// FETCHING DATA FROM DB
router.get('/api',getData);

// SEED DATA FROM CSV FILE
router.post('/api/seed',seedData);

// DELETE ALL DATA FROM DB   
router.post('/api/reset',resetData);


module.exports=router;