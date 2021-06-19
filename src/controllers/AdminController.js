const Registration = require('../models/Registration');
const Event = require("../models/Event");
const mail = require("../utils/generateMail");

module.exports = {
    async sendmails(req, res) {
        try {
            const { message } = req.body;
            const { eventId } = req.params;
            let emails = []
            const event = await Event.findById(eventId);
            const registration = await Registration.findOne({ event: eventId }).populate('users');
            if (registration) {
                registration.users.forEach(async user => {
                    emails.push(user.email)
                })
            }
            console.log(emails)
            let mailOptions = {
                from: "ADMIN <educationforram@gmail.com>",
                to: emails,
                subject: `Information regarding ${event.title} `,
                attachDataUrls: true,
                html: `
                <p>${message}</p>
                <br/>
              `,
            }
            mail.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.status(400).json(error)
                } else {
                    return res.status(200).json({
                        message: 'Details sent successfully',
                    });
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    },
}