import express from 'express';
import { designationController } from '../../controllers'
const router = express.Router();

router
  .route('/')
  .post(designationController.createDesignations)
  .get(designationController.getDesignations)
  .delete(designationController.deleteDesignation)

export default router;
