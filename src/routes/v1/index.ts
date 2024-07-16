import express from 'express';
import roleRoute from './roles.route'
import departmentRoute from './department.route'
import userRoute from './users.route'
import officerRoute from './officer.type.route'
import designationRoute from './designation.route'
import moduleRoute from './module.route'
import RoleMappingRoute from './user.role.mappimg'
const router = express.Router();

const defaultRoutes = [
  {
    path: '/roles',
    route: roleRoute
  },
  {
    path: '/departments',
    route: departmentRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/usersrolemapping',
    route: RoleMappingRoute
  },
  {
    path: '/officertype',
    route: officerRoute
  },
  {
    path: '/designations',
    route: designationRoute
  },
  {
    path: '/module',
    route: moduleRoute
  }
];



defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
