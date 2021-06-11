const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    rollno: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    marks: {
      type: Number,
      default: 0
    },
    password: {
      type: String,
      required: true,
    },
    resetToken:String,
    expireToken:Date,
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    profilepic: {
      type: String,
      required: true
    },
    profilepic_id: {
      type: String,
      required: true
    },
  }, {
  toJSON: {
    virtuals: true
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model("User", UserSchema);