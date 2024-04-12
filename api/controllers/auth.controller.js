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
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY )
        //separating password
        const { password: pass, ...rest} = validUser._doc
        //adding token to cookies
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
    } catch (error) {
        next(error)
    }
}