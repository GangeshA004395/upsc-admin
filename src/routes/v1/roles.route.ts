import express from 'express';
import { rolesController } from '../../controllers'
const router = express.Router();

router
  .route('/')
  .post(rolesController.createRoles)
  .get(rolesController.getRoles)
  .delete(rolesController.deleteRole)

export default router;
