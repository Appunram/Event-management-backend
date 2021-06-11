const User = require("../models/User");
const Token = require("../models/Token");
const generateToken = require("../utils/generateToken");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require("../config/cloudinary");
const mail = require("../utils/generateMail");



module.exports = {
    async createUser(req, res) {
        try {
            const { firstname, lastname, rollno, department, email, password, confirmpassword } = req.body
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "users" });
            console.log(result)
            const existentUser = await User.findOne({ email })

            if (password !== confirmpassword) {
                return res.status(400).json({
                    message: "Password Not Matched!",
                });
            }
            else {
                if (!existentUser) {
                    const user = await User.create({
                        firstname,
                        lastname,
                        rollno,
                        department,
                        email,
                        password,
                        profilepic: result.secure_url,
                        profilepic_id: result.public_id,
                    })
                    return res.json(user)
                }

                return res.status(400).json({
                    message:
                        'email already exist!  do you want to login instead? ',
                });
            }

        } catch (err) {
            throw Error(`Error while Registering new user :  ${err}`)
        }
    },

    async authUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (user && (await user.matchPassword(password))) {
                const accessToken = await generateToken.generateToken(user._id);
                const refreshToken = await generateToken.generateRefreshToken(user._id);
                return res.status(200).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: {
                        _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        department: user.department,
                        rollno: user.rollno,
                        isAdmin: user.isAdmin,
                    },
                });
            } else {
                return res.status(400).json({
                    message: "Invalid Username and Password"
                });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    },

    async refreshTokens(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(403).json({ error: "Access denied,token missing!" });
            } else {
                const token = await Token.findOne({ refreshToken });
                if (!token) {
                    return res.status(401).json({ error: "Token expired!" });
                } else {
                    const payload = jwt.verify(
                        token.refreshToken,
                        process.env.REFRESH_TOKEN_SECRET
                    );
                    const accessToken = jwt.sign(
                        { id: payload.id },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
                    );
                    return res.status(200).json({ accessToken });
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error!" });
        }
    },

    async logOut(req, res) {
        try {
            const { refreshToken } = req.body;
            await Token.findOneAndDelete({ refreshToken });
            return res.status(200).json({ success: "User logged out!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error!" });
        }
    },

    async getUserProfile(req, res) {
        try {
            const user = await User.findById(req.user._id)
            if (user) {
                res.json({
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    rollno: user.rollno,
                    department: user.department,
                    profilepic: user.profilepic,
                    profilepic_id: user.profilepic_id
                })
            } else {
                return res.status(404).json({
                    message: "User not found"
                });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    },

    async updateUserProfile(req, res) {
        try {
            const user = await User.findById(req.user._id)
            if (user) {
                user.firstname = req.body.firstname || user.firstname
                user.lastname = req.body.lastname || user.lastname
                user.rollno = req.body.rollno || user.rollno
                user.department = req.body.department || user.department
                user.email = req.body.email || user.email
                await user.save()
                return res.status(200).json({ message: 'Details Updated Sucessfully' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    },

    async updateUserPhoto(req, res) {
        try {
            const user = await User.findById(req.user._id)
            await cloudinary.uploader.destroy(user.profilepic_id);
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "users" });
            if (user) {
                user.profilepic = result.secure_url || user.profilepic
                user.profilepic_id = result.public_id || user.profilepic_id
                await user.save()
                return res.status(200).json({ message: 'Profile Photo Updated Sucessfully' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    },

    async getAllUsers(req, res) {
        try {
            const { department } = req.params;
            const query = department ? { department } : {}
            const users = await User.find(query)

            if (users) {
                return res.json(users)
            }
        } catch (error) {
            return res.status(400).json({ message: 'We do have any users yet' })
        }
    },

    async forgotPassword(req, res) {
        try {
            const token = crypto.randomBytes(20).toString("hex");
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ message: "User don't exists with that email" })
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            await user.save();
            const htmlContent = `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
                <p>http://localhost:3000/reset/${token}</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
              `;

            let mailOptions = {
                from: "ADMIN <educationforram@gmail.com>",
                to: `${user.email}`,
                subject: 'RESET PASSWORD',
                attachDataUrls: true,
                html: htmlContent,
            }
            mail.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.status(400).json(error)
                } else {
                    return res.json({
                        message: 'Check Your Email To Reset Password',
                    });
                }
            });
        } catch (error) {
            console.log(error)
            return res.json({ message: error });
        }
    },

    async resetPassword(req, res) {
        try {
            const newPassword = req.body.password
            const newConfirmPassword = req.body.confirmpassword
            const sentToken = req.body.token
            console.log(newPassword, newConfirmPassword, sentToken);
            const user = await User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
            console.log(user)
            if (!user) {
                return res.status(400).json({ message: "Try again session expired" })
            }
            if (newPassword == newConfirmPassword) {
                user.password = newPassword
                user.resetToken = undefined
                user.expireToken = undefined
                await user.save();
                res.status(200).json({message: "password updated successfully, You can now Login"})
            } else {
                res.status(400).json({ message: "password didn't match" })
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error });
        }
    },
    
    async updatePassword(req, res) {
        try {
            const newPassword = req.body.password
            const newConfirmPassword = req.body.confirmpassword
            const user = await User.findById(req.user._id)
            if (user) {
                if (newPassword == newConfirmPassword) {
                    user.password = newPassword
                    await user.save();
                    res.status(200).json({message: "password updated successfully, You can now Login"})
                } else {
                    res.status(400).json({ message: "password didn't match" })
                }
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    },
}