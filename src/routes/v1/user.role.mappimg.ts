import express from 'express';
import { userRoleController } from '../../controllers'
const router = express.Router();

router
  .route('/')
  .post(userRoleController.createUserRoleMapping)
  .get(userRoleController.getUserRoleMapping)
  .delete(userRoleController.deleteUserRoleMapping)

export default router;