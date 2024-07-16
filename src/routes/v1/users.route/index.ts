import express from 'express';
import { userTypeController } from '../../../controllers'
const router = express.Router();

router
  .route('/type')
  .post(userTypeController.createUserType)
  .get(userTypeController.getUserType)
  .delete(userTypeController.deleteUserType)

export default router;