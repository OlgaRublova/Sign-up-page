const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto') // no need to install, it's in 'node' module

//user model -schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a basic email"]
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: [8, "A password must have at least 8 characters"],
        select: false, // to hide encrypted password
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            //this only works on CREATE & SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // passwordCurrent: String,
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'moderator'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

//this middleware happens between getting the data and
// saving it into the data base
userSchema.pre('save', async function (next) {
    //if password wasn't changed, move to the next function
    if (!this.isModified('password')) return next();

    //hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    //we don't need to save passConfirm into the db
    //we used it only to make sure that a user typed in correct password
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', async function (next) {
    //if password isn't modified or document is new,   don't change the password
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
})

// userSchema.pre(/^find/, function(next) {
userSchema.pre('find', function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp)

        return JWTTimestamp < changedTimestamp;
    }

    //means that password wasn't changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {

    //generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    //resetting token
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //valid for 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


//model should start with a capital letter
const User = mongoose.model("User", userSchema);

module.exports = User;