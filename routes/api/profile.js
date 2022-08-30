const express = require('express');
const router = express.Router();
const request = require('request');
const configure = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { Router } = require('express');

//@route GET api/profile/me
//@description Get current user profile
//@access Public
router.get('/me', async (req, res) =>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name','avatar']
        );

        if(!profile){
            return res.status(400).json({error: "User not found"});
        }

        res.json(profile);
    } catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
    }
});

//@route POST api/profile
//@description Create/Update user profile
//@access Private

router.post('/',[auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills','Genres is required').not().isEmpty(),
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        github
    } = req.body;
//Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if( githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
//Build social object
    profileFields.social={};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(github) profileFields.social.github = github;
    if(instagram) profileFields.social.instagram = instagram;
    console.log(profileFields.skills);
    
    try{
        let profile = await Profile.findOne({user: req.user.id});

        if(profile){
            //Update profile
            profile=  await Profile.findOneAndUpdate({ user: req.user.id}, {$set:
            profileFields},
            {new:true});

            return res.json(profile);
        }

        //create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
}
);


//@route GET api/profile
//@description Get all profiles
//@access Private

router.get('/',async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//@route GET api/profile/user/user_id
//@description Get profile by user id
//@access Public

router.get('/user/:user_id',async (req, res) => {
    try {
        const profile = await Profile.find({user : req.params.user_id}).populate('user',['name','avatar']);
        
        if (!profile) return res.status(400).json({msg:"Profile not found"});
        
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg:"Profile not found"});
        }
        res.status(500).send('server error');
    }
});

//@route Delete api/profile
//@description Delete profile,user and posts
//@access Private

router.delete('/',auth,async (req, res) => {
    try {
        //@todo = remove user's posts


        //remove Profile
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg:'user removed'});
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//@route POST api/profile/experience
//@description add profile experience
//@access Private

router.put('/experience',[
    auth,[
        check('title','Title is required').not().isEmpty(),
        check('company','company is required').not().isEmpty(),
        check('from','from date is required').not().isEmpty()
    ]
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
        
    }
});

//@route DELETE api/profile/experience/exp_id
//@description DELETE experience from profile
//@access Private

router.delete('/experience/:exp_id', auth ,async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        
        //Get remove Index
        const removeIndex = profile.experience.map(item => item.id).indexOf
        (req.param.exp_id);

        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//@route POST api/profile/education
//@description add profile education
//@access Private

router.put('/education',[
    auth,[
        check('school','school is required').not().isEmpty(),
        check('degree','degree is required').not().isEmpty(),
        check('field of study','field of study is required').not().isEmpty(),
        check('from','from date is required').not().isEmpty()
    ]
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,   
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,   
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
        
    }
});

//@route DELETE api/profile/education/exp_id
//@description DELETE education from profile
//@access Private

router.delete('/education/:edu_id', auth ,async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        
        //Get remove Index
        const removeIndex = profile.education.map(item => item.id).indexOf
        (req.param.edu_id);

        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//@route GET  api/profile/github/:username
//@description get user github repo 
//@access public

router.get('/profile/github/:username', auth ,async (req, res) => {
    try {
        const options ={
            uri:`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&
            client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers:{'user-agent': 'node.js'}
        };

        request(options,(error,response,body)=>{
            if(error) console.error(error);

            if(response.satusCode !==200){
                return res.status(404).json({msg:"Nof Github Profile Found!"});
            }
            res.json(JSON.parse(body)); 
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

module.exports = router;