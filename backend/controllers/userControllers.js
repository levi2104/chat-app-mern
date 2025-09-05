import generateToken from "../config/generateToken.js"
import User from "../models/userModel.js"
import bcrypt from 'bcrypt'

export const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body

  if(!name || !email || !password){
    res.status(400)
    throw new Error('Please Enter all the Fields')
  }
  
  const userExists = await User.findOne({ email })

  if(userExists){
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const userData = { name, email, password: hashedPassword }

  if(pic) userData.pic = pic // if pic is uploaded, then only set it, else dont set it, default pic will be set

  const user = await User.create(userData)

  if(user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  }
  else{
    res.status(400);
    throw new Error("Failed to create the user");
  }
}

export const authUser = async (req, res) => {
  const { email, password } = req.body

  const userExists = await User.findOne({ email })

  if(!userExists){
    res.status(400);
    throw new Error("User with this email doesn't exist");
  }

  const passwordMatching = await bcrypt.compare(password, userExists.password)
  
  if(passwordMatching){
    res.status(201).json({
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      pic: userExists.pic,
      token: generateToken(userExists._id),
    });
  }
  else{
    res.status(400)
    throw new Error('Wrong Password')
  }
}

export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};