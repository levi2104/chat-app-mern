import express from 'express'
import { authUser, registerUser, allUsers } from '../controllers/userControllers.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

// router.post('/login', authUser)
router.post('/register', registerUser)
router.post('/login', authUser)
router.get('/all', protect, allUsers)

export default router