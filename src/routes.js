const express = require("express");

const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");
const RegistrationController = require("./controllers/RegistrationController");
const PaymentController = require("./controllers/PaymentController");
const AttendanceController = require("./controllers/AttendanceController");
const CompilerController = require("./controllers/CompilerController");

const upload = require("./config/multer");
const MiddleWare = require("./middleware/authmiddleware");


const routes = express.Router();



routes.get('/',(req,res) => {
    res.send("Hello from Ram");
});

//user
routes.post('/register',upload.single("profilepic"),UserController.createUser);
routes.route('/user/profile').get(MiddleWare.protect,UserController.getUserProfile).put(MiddleWare.protect,UserController.updateUserProfile);
routes.put('/user/profilephoto',upload.single("profilepic"),MiddleWare.protect,UserController.updateUserPhoto);
routes.post('/login',UserController.authUser);
routes.get('/users',UserController.getAllUsers);
routes.get('/users/:department',UserController.getAllUsers);
routes.post('/token',UserController.refreshTokens);
routes.post('/logout',UserController.logOut);
routes.post('/forgot-password',UserController.forgotPassword);
routes.put('/resetpassword',UserController.resetPassword);
routes.put('/updatepassword',MiddleWare.protect,UserController.updatePassword);

//attendance
routes.post('/searchuser',MiddleWare.protect,MiddleWare.admin,AttendanceController.searchUser);
routes.get('/:eventId/accept',MiddleWare.protect,AttendanceController.acceptUser);
routes.get('/attendances',AttendanceController.getAllAttendances);
routes.get('/event/:eventId/attendedusers',MiddleWare.protect,MiddleWare.admin,AttendanceController.getAttendance);
routes.route('/:eventId/marks').post(MiddleWare.protect,AttendanceController.setMarks).get(AttendanceController.getMarks);
routes.get('/isattend/:eventId',MiddleWare.protect,AttendanceController.isAttended);

//event
routes.post('/admin/createevent',MiddleWare.protect,MiddleWare.admin,upload.single("thumbnail"),EventController.createEvent);
routes.get('/events',EventController.getAllEvents);
routes.get('/events/:category',EventController.getAllEvents);
routes.get('/event/:eventId',MiddleWare.protect,EventController.getEvent)
routes.route('/manageevents/:eventId').put(MiddleWare.protect,MiddleWare.admin,upload.single("thumbnail"),EventController.updateEvent).delete(MiddleWare.protect,MiddleWare.admin,EventController.deleteEvent);


//registration
routes.post('/event/:eventId/register',MiddleWare.protect,RegistrationController.createRegistration);
routes.get('/event/:eventId/registeredusers',MiddleWare.protect,MiddleWare.admin,RegistrationController.getRegistration);
routes.get('/registrations',RegistrationController.getAllRegistrations);
routes.delete('/event/:eventId/unregister',MiddleWare.protect,MiddleWare.admin,RegistrationController.deleteRegistration);
routes.get('/isregister/:eventId',MiddleWare.protect,RegistrationController.isRegistered);
routes.get('/myevents',MiddleWare.protect,RegistrationController.getMyEvents);
routes.delete('/manageregistrations/:eventId',MiddleWare.protect,MiddleWare.admin,EventController.deleteEvent);


//payment
routes.post('/payment',PaymentController.PaymentGateway);

//compiler
routes.post('/run',CompilerController.runProgram);
routes.get('/status',CompilerController.programStatus);

module.exports = routes;