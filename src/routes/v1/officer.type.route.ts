import express from 'express';
import { officerTypeController } from '../../controllers'
const router = express.Router();
router
  .route('/')
  .post(officerTypeController.createOfficerType)
  .get(officerTypeController.getOfficerType)
  .delete(officerTypeController.deleteOfficertype)

export default router;
