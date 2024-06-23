import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    //object destructuring
    const { username, email, password } = req.body

    if(!username || !email || !password || username == '' || email == '' || password == ''){
        next(errorHandler(400, 'All fields are required'))
    }

    //hashing the password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        //here if the key and value are same then we can skip any one of them
        username: username,
        email,
        password: hashedPassword
    })

    //if an error occurs then it will throw to the application
    try {
        //save new user
    await newUser.save()

    //create a response with json
    res.json('Sign Up successfull')
        
    } catch (error) {
        next(error)
    }
}

//creating a sign in component
export const signin = async (req, res, next) => {
    //getting username and password from ui
    const { email, password } = req.body

    //setting an error depending on certain conditions
    if(!email || !password || email === '' || password === ''){
        next(errorHandler(400, 'All fields are required'))
    }

    //validating user
    try {
        const validUser = await User.findOne({email})
        if(!validUser){
            next(errorHandler(404, 'User not found'))
        }
        //comparing existing password with password if user is valid
        const validPassword = bcryptjs.compareSync(password, validUser.password)

        //if password not valid create an error
        if(!validPassword) {
            return next(errorHandler(400, 'Invalid password'))
        }

        //if both are correct create a token
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET_KEY )
        //separating password
        const { password: pass, ...rest} = validUser._doc
        //adding token to cookies
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
    } catch (error) {
        next(error)
    }
}

//creating a google signin component
export const google = async (req, res, next) => {
    //checking if user exists or not
    const { email, name, googlePhotoUrl } = req.body
    try {
        //searching for email
        const user = await User.findOne({email})
        if(user){
            //creating a token
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY)
            const {password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
        else {
            //creating a random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            
            //hashing a generated random password with 10 round of salt
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

            //creating new user
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })

            //saving new user
            await newUser.save()

            //creating a token
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET_KEY)

            //separate a password from this new user
            const { password, ...rest } = newUser._doc

            //creating a response
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
            
        }
    } catch (error) {
        next(error)
    }
}