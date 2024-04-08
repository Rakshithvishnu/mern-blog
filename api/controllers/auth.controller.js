import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req,res) => {
    //object destructuring
    const { username, email, password } = req.body

    if(!username || !email || !password || username == '' || email == '' || password == ''){
        return res.status(400).json({ message: 'All fields are required'})
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
        res.status(500).json({message: error.message})
    }
}