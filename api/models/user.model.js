import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,    
    },

    profilePicture: {
        type: String,
        default: "https://images.app.goo.gl/EhdcCH2oS4Mw9Khw5",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true},)

//creating a model
const User = mongoose.model('User', userSchema)

export default User