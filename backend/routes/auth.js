const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwt_secreat = "SurajIsGood";
const fetchuser = require('../middleware/fetchuser')


router.post('/createuser',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Enter a valid password').isLength({ min: 8 })
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "Email already exists" });
            }
            let salt = await bcrypt.genSalt(10);
            let secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });
            const data = {
                user: user.id,
            };
            const authtoken = jwt.sign(data, jwt_secreat);
            res.json({ authtoken });
        } catch (err) {
            return res.status(400).json({ error: "Server Error" });
        }
    }
);

router.post('/login',
    [body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').exists()
    ],
    async (req, res) => {
        let success = false
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: "Invalid Email" });
            }
            const passComp = await bcrypt.compare(password, user.password);
            if (!passComp) {
                success = false
                return res.status(400).json({ success, error: "Invalid Password" });
            }
            const data = {
                user: user.id,
            };
            const authtoken = jwt.sign(data, jwt_secreat);
            success = true
            res.json({ success, authtoken });


        } catch (err) {
            return res.status(400).json({ error: "Server Error" })
        }
    }
)

router.post('/getuser', fetchuser,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server Error" });
        }
        // try {
        //     userId = req.user.id;
        //     const user = await User.findById(userId).select("-password");
        //     res.json(user);
        // } catch (error) {
        //     console.error(error.message);
        //     res.status(500).send("Server Error")
        // }
    }
)

module.exports = router;
