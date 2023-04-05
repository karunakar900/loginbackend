const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const datamodel = require('../Schema/Userschema');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { json } = require("express");

dotenv.config();

Router.post("/register",
    [
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        check('confirmpassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password is mismatch with confirmpassword');
            }
            return true;
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const user = await datamodel.findOne({ email: email });
            if (user) {
                res.status(409).json({
                    status: "failed",
                    message: "user with this email already exist"
                })
            } else {
                bcrypt.hash(password, 10, async function (err, hash) {
                    if (err) {
                        return res.status(400).json({ message: err.message });
                    }
                    const newuser = await datamodel.create({
                        email: email,
                        password: hash,
                    })
                    res.status(200).json({
                        status: "registration success",
                        result: newuser
                    });
                })
            }

        } catch (e) {
            res.status(500).json({
                status: "failed",
                message: e.message
            });
        }
    });


Router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userData = await datamodel.findOne({ email: email });
    if (userData != null) {
        let result = await bcrypt.compare(password, userData.password);
        if (result) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 10) + 60 * 60,
                    data: userData._id,
                },
                process.env.JWT_KEY
            );
            res.status(200).json({
                Status: "Successful",
                token: token,
            });
        } else {
            res.status(400).json({
                status: "failed",
                message: "Wrong Password",
            });
        }
    } else {
        res.status(400).json({
            status: "failed",
            message: "No user Found",
        });
    }

})






module.exports = Router;
