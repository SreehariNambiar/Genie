const router = require('express').Router()
const Pin = require('../models/Pin')

//create a pin

router.post("/", async(req, res) => {
    const newPin = new Pin(req.body)
    try {
        const savedPin = await newPin.save()
        res.status(200).json(savedPin)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all pins

router.get("/", async(req,res) => {
    try {
      const pins = await Pin.find()  //gives all the pins similar to postgres select * queryy
      res.status(200).json(pins)
    } catch (error) {
        console.error(error.message)
        res.status(500).json(error)
    }
})
module.exports = router