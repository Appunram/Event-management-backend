const User = require("../models/User");
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');


module.exports = {
    async searchUser(req, res) {
        try {
            const { rollno } = req.body;
            const user = await User.findOne({ rollno: rollno })
            if (user) {
                return res.status(200).json(user)
            }
        } catch (error) {
            return res.status(400).json({ message: "No Users Found" })
        }
    },

    async acceptUser(req, res) {
        try {
            const { user_id } = req.headers;
            const { eventId } = req.params;
            const registration = await Registration.findOne({ event: eventId }).populate('users');
            if (registration) {
                registration.users.forEach(async user => {
                    if (user._id == user_id) {
                        console.log(user_id)
                        const Existingattendance = await Attendance.findOne({ event: eventId });
                        if (Existingattendance) {
                            Existingattendance.users.push(user_id);
                            await Existingattendance.save();
                        }
                        else {
                            const attendance = await Attendance.create({
                                event: eventId,
                                users: [user_id],
                            })
                        }
                        return res.status(204).send();
                    }
                });
            } else {
                return res.status(400).json({ message: "No Registrations found" });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    },

    async getAllAttendances(req, res) {
        try {
            const attendances = await Attendance.find({})
            return res.json(attendances)
        } catch (error) {
            return res.status(400).json({ message: `${error} We do have any registrations yet` })
        }
    },

    async getAttendance(req, res) {
        try {
            const { eventId } = req.params;
            const attendance = await Attendance.findOne({ event: eventId });
            if (attendance) {
                await attendance
                    .populate('users', '-password')
                    .execPopulate();
                return res.status(200).json(attendance);
            } else {
                return res.status(200).json(attendance)
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }

    },

    async setMarks(req, res) {
        try {
            const { eventId } = req.params;
            const { mark } = req.body;
            console.log(req.user._id)
            console.log(mark)
            const Mark = await Marks.create({
                marks: mark,
                event: eventId,
                user: req.user._id,
            })
            return res.status(204).send();
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    },

    async getMarks(req, res) {
        try {
            const { eventId } = req.params;
            const marks = await Marks.find({ event: eventId })
            let a = []
            marks.forEach(mark => {
                a.push(mark.marks)
            })
            return res.status(200).json(marks)
        } catch (error) {
            return res.status(400).json({ message: `${error} We do have any participation yet` })
        }
    },

    async isAttended(req, res) {
        try {
            let isAttend = false;
            const { user_id } = req.headers;
            const { eventId } = req.params;
            console.log(req.user._id)
            const marks = await Marks.find({ event: eventId })
            marks.map(mark => {
                console.log(mark.user)
                if (user_id == mark.user) {
                    isAttend = true;
                }
            });
            return res.status(200).json({ isAttend: isAttend });
        } catch (error) {
            console.log(error)
        }
    },
}