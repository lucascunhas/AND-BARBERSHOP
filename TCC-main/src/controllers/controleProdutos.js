const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const slugify = require('slugify');
const adminAut = require('../middlewares/adminAutoriz');

router.use(bodyParser.urlencoded({extended:true}));

router.get("/produtos", adminAut, (req,res)=>{
    res.render("produtos/listaProdutos");
})

module.exports = router;