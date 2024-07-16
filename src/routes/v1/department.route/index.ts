import express from 'express';
import { departmentsController } from '../../../controllers'
const router = express.Router();

router
  .route('/')
  .post(departmentsController.createDepartments)
  .get(departmentsController.getDepartments)
  .delete(departmentsController.deleteDepartment)

export default router;