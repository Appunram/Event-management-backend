const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary")

module.exports = {
    async createEvent(req, res) {
        try {
            const { title, category, description, sponsors, price, date, registrationenddate } = req.body;
            const result = await cloudinary.uploader.upload(req.file.path,{folder: "events"});
            console.log(result)
            const event = await Event.create({
                title,
                category,
                description,
                sponsors,
                price,
                date,
                registrationenddate,
                thumbnail: result.secure_url,
                thumbnail_id: result.public_id,
            });
            return res.json(event);
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    },

    async getAllEvents(req, res) {
        try {
            const { category } = req.params;
            const query = category ? { category } : {}
            const events = await Event.find(query)

            if (events) {
                return res.json(events)
            }
        } catch (error) {
            return res.status(400).json({ message: 'We do have any events yet' })
        }
    },

    async getEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId);
            if (event) {
                return res.json(event)
            }
        } catch (error) {
            return res.status(400).json({
                message: "Event Id does not exist !"
            });
        }
    },

    async updateEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId)
            await cloudinary.uploader.destroy(event.thumbnail_id);
            const { title, category, description, sponsors, price, date, registrationenddate } = req.body;
            const result = await cloudinary.uploader.upload(req.file.path,{folder: "events"});
            if (event) {
                event.title = title || event.title
                event.category = category || event.category
                event.description = description || event.description
                event.sponsors = sponsors || event.sponsors
                event.price = price || event.price
                event.date = date || event.date
                event.registrationenddate = registrationenddate || event.registrationenddate
                event.thumbnail = result.secure_url || event.thumbnail
                event.thumbnail_id = result.public_id || event.thumbnail_id
                await event.save()
                return res.status(200).json({ message: 'Event Updated Sucessfully' });
            } else {
                return res.status(400).json({ message: 'Event not found' });
            }
        } catch (error) {
            return res.status(400).json({ message: `${error}` })
        }
    },

    async deleteEvent(req, res) {
        try {
            const { eventId } = req.params;
            let event = await Event.findById(eventId);
            await cloudinary.uploader.destroy(event.thumbnail_id);
            await event.remove();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({
                message: "we do not have any event with ID"
            });
        }
    }
}