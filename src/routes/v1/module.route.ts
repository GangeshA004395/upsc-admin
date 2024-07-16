import express from 'express';
import { moduleController } from '../../controllers'
const router = express.Router();
router
  .route('/')
  .post(moduleController.createModule)
  .get(moduleController.getModules)
  .delete(moduleController.deleteModule)

export default router;
