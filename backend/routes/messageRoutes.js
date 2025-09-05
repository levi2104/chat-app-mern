import express from 'express'
import { allMessages, sendMessage } from '../controllers/messageControllers.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, sendMessage)
router.get('/:chatId', protect, allMessages)

export default router