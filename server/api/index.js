// Implement Container api
import { Router } from 'express'

import users from './users'
import dockersAPI from './dockers'
import digitsAPI from './digits'
import digitsCAPI from './digitsContainer'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(dockersAPI)
router.use(digitsAPI)
router.use(digitsCAPI)

export default router
