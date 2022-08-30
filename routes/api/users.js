const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


//@route POST api/users
//@description Test route
//@access Public
router.post('/', [
    check('name', 'Username is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6})
],async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    
    const {name,email,password} =req.body;
    try{
    //seeing if the user exists
    let user = await User.findOne({ email});
    if  (user){
        return res.status(400).json({ errors: [{msg: 'User already exists'}]});
    }

    //get the user's gravatar
    const avatar = gravatar.url(email,{
        s: '200',//default size
        r: 'pg',//rating, which here is pg
        d: 'mm'//default image or a default user icon
    })

    user = new User({
        name, email, avatar, password
    });

    //Encrypt Password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //return jsonwebtoken
    const payload = {
        user:{
            id:user.id
        }
    }
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 36000},
        (err,token) => {
            if (err) throw err;
            res.json({ token});
        }
    );
    // res.send('User registered'); 
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
     
});

module.exports = router;
