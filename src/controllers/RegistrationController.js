const Registration = require('../models/Registration');
const User = require("../models/User");
const Event = require("../models/Event");
const QRCode = require('qrcode');
const mail = require("../utils/generateMail");


module.exports = {
    async createRegistration(req, res) {
        try {
            const { eventId } = req.params;

            const userDetails = await User.findById(req.user._id)
            const eventDetails = await Event.findById(eventId);

            const qrcode = await QRCode.toDataURL(`${userDetails.email}`);


            const htmlContent = `
                <h1><strong>SUCESSFULLY REGISTERED</strong></h1>
                <h3>Hi, You are registered for the below event</h3>
                <h3><b>Event title:</b> ${eventDetails.title}</h3>
                <h3><b>Event Category:</b> ${eventDetails.category}</h3>
                <h3><b>Event Date:</b> ${eventDetails.date}</h3>
                <img src="` + qrcode + `" alt="QR code" width="250px" height="250px"/>
                <br/>
              `;

            let mailOptions = {
                from: "ADMIN <educationforram@gmail.com>",
                to: `${userDetails.email}`,
                subject: 'Event + Invitation',
                attachDataUrls: true,
                html: htmlContent,
            }
            const Existingregistration = await Registration.findOne({ event: eventId });

            if (Existingregistration) {
                Existingregistration.users.push(req.user._id);
                await Existingregistration.save();
                mail.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(400).json(error)
                    } else {
                        return res.json({
                            message: 'Sucessfully Registered for Event ',
                        });
                    }
                });
            }
            else {
                const registration = await Registration.create({
                    event: eventId,
                    users: [req.user._id],
                })
                mail.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(400).json(error)
                    } else {
                        return res.json({
                            message: 'Sucessfully Registered for Event ',
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }

    },

    async getRegistration(req, res) {
        const { eventId } = req.params;
        try {
            const registration = await Registration.findOne({ event: eventId });
            await registration
                .populate('users', '-password')
                .execPopulate();

            return res.json(registration);
        } catch (error) {
            return res.status(400).json(error)
        }

    },

    async getAllRegistrations(req, res) {
        try {
            const registrations = await Registration.find({})
            return res.json(registrations)
        } catch (error) {
            return res.status(400).json({ message: 'We do have any registrations yet' })

        }
    },

    async deleteRegistration(req, res) {
        try {
            const { user_id } = req.headers;
            const { eventId } = req.params;
            const registration = await Registration.findOne({ event: eventId });
            registration.users.pull(user_id);
            await registration.save();
            await registration
                .populate('event')
                .populate('users', '-password')
                .execPopulate();
            res.json(registration);
        } catch (error) {
            res.status(400).send(error);
        }
    },

    async isRegistered(req, res) {
        try {
            let isRegister = false;
            const { user_id } = req.headers;
            const { eventId } = req.params;
            const registration = await Registration.findOne({ event: eventId });
            registration.users.forEach(user => {
                if (user == user_id) {
                    isRegister = true
                }
            });
            return res.status(200).json({ isRegister: isRegister });
        } catch (error) {
            console.log(error)
        }
    },

    async getMyEvents(req, res) {
        try {
            const registrations = await Registration.find({ "users": req.user._id }).populate('event');
            return res.status(200).json(registrations);
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async deleteRegistration(req, res) {
        try {
            const { eventId } = req.params;
            const registration = await Registration.findOne({ event: eventId });
            await registration.remove();
            return res.status(204).send();
        } catch (error) {
            res.status(400).send(error);
        }
    },

}