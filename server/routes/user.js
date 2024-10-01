const router = require('express').Router()
const User = require("../models/User")
const bcrypt = require('bcrypt')

//register

router.post('/register', async(req,res) => {
    try {
       //generate a password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(req.body.password, salt)
       //create a user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        //save user and response
        const user = await newUser.save();
        res.status(200).json(user._id)

    } catch (error) {
        console.error(error.message)
        res.status(500).json(error)
    }
})


//LOGIN
router.post("/login", async (req, res) => {
    try {
      //find user
    
      const user = await User.findOne({ username: req.body.username });
      if(!user){
        return res.status(401).json("Wrong username or password")}
        ;
        // console.log(user)
      //validate password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      // console.log(user)
      if(!validPassword) {
        return res.status(401).json("Wrong username or password"); 
      }
  
      //send response
      res.status(200).json({ _id: user._id, username: user.username });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router