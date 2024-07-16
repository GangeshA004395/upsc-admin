import "dotenv/config";
import asyncHandler from "express-async-handler";
import dayjs from "dayjs";
import { userRoleMappingServices } from "../services";

/*
 * POST localhost:8080/api/v1/roles
 * Register an admin using Phone & password only
 * In real world, OTP should be used to verify phone number
 * But in this app, we will simulate fake OTP - 123456
 */

const createUserRoleMapping = asyncHandler(async (req, res, next) => {
    try {
        let jsonData  = req.body;
        
        //20-Jun-2024 11:34
        jsonData.createdDt = dayjs().format('D-MMM-YYYY HH:mm');
        jsonData.modifiedDt = dayjs().format('D-MMM-YYYY HH:mm');
        let createResponse =  await userRoleMappingServices.createRoleMapping(jsonData);
        res.status(createResponse?.code)?.json({ msg: createResponse?.msg, status: createResponse?.code == 201 ? true:false})
    } catch(E:any) {
        res.status(400).json({ msg: E.stack, status:false})
    }
   
});
const getUserRoleMapping = asyncHandler(async (req, res, next) => {
    try {
        let {
            pageno= '1',
            perpage='10',
            id = '',
            isActive=''
        } = req?.query;
        let getRoleQuery: any = {pageno , perpage, id,isActive }

        let createResponse =  await userRoleMappingServices.getRoleMapping(getRoleQuery);
        res.status(createResponse?.code)?.json({ msg: createResponse?.msg, status: [201,200].includes(createResponse?.code)? true:false, data: createResponse?.data})
    } catch(E:any) {
        res.status(400).json({ msg: E.stack,status:false})
    }
   
});
const deleteUserRoleMapping  = asyncHandler(async (req, res, next) =>{
    try {
        let {
            userrolemasterid, 
            id
        } = req.query;
        let deleteResponse = await userRoleMappingServices.deleteRoleMapping(userrolemasterid, id);
        res.status(deleteResponse?.code)?.json({ msg: deleteResponse?.msg, status: [201,200].includes(deleteResponse?.code)? true:false, data: deleteResponse?.data})

    } catch(e:any) {
        res.status(400).json({ msg: e.stack, status:false})
    }
})
export default {
    createUserRoleMapping,
    getUserRoleMapping,
    deleteUserRoleMapping
}
