import "dotenv/config";
import clientPromise from '../db'

import { paginate } from '../utils/pagination'


const createRoleMapping = async (roleBody: any) => {
  try {
    let db = await clientPromise;
    let role_mapping = await db.collection('MST_User_Role_Mapping');
    roleBody.userRoleMasterId = (await role_mapping.count()) + 1

    let insertedDoc = await role_mapping.updateOne({
      userRoleMasterId: roleBody.userRoleMasterId
    },
      { $setOnInsert: roleBody },
      { upsert: true }
    );
    console.log("insertedDoc",insertedDoc)

    if (insertedDoc && insertedDoc?.upsertedId !== null && insertedDoc?.upsertedCount == 1) {
      return {
        error: false,
        data: insertedDoc?.upsertedId,
        code: 201,
        msg: 'new module is created'
      }
    } else {
      return {
        error: false,
        code: 400,
        msg: 'moduleNameEn duplicate'
      }
    }
  } catch (e: any) {
    return {
      error: true,
      code: 500,
      msg: e?.stack
    }
  }

};

const getRoleMapping = async (query: any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('MST_User_Role_Mapping');
    let filters: any = { createdBy: query.id };

    if (query?.isActive && query?.id) {
      filters = {
        '$and': [
          { 'createdBy': query.id },
          { 'isActive': query.isActive },
        ]
      }
    }

    let pagData = await paginate(role, parseInt(query.pageno), parseInt(query.perpage), filters)
    if (pagData && Array.isArray(pagData?.data)) {
      return {
        data: {
          list: pagData?.data,
          meta: {
            currentPage: pagData?.currentPage,
            previousPage: pagData?.previousPage,
            nextPage: pagData?.nextPage,
            lastPage: pagData?.lastPage,
            countPerPage: pagData?.countPerPage
          }
        },
        error: false,
        code: 200,
        msg: 'module listed',
      }
    } else {
      return {
        data: [],
        error: false,
        code: 400,
        msg: 'module collection is empty'
      }
    }
  } catch (e: any) {
    return {
      error: true,
      code: 500,
      msg: e?.stack
    }
  }

};



const deleteRoleMapping = async (userrolemasterid: string | any, id: string | any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('MST_User_Role_Mapping');
    // create a filter for a movie to update
    const filter = { '$and': [{ createdBy: id }, { 'userRoleMasterId': parseInt(userrolemasterid) }] };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: false };
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        isActive: 'N'
      },
    };
    let docs = await role.updateOne(filter, updateDoc, options);;

    if (docs && docs?.modifiedCount == 1) {
      return {
        data: docs,
        error: false,
        code: 200,
        msg: 'module is modified'
      }
    } else {
      let msg_ = docs?.matchedCount == 0 ? `no document matched give admin id ${id} and moduleId ${userrolemasterid}` : docs?.modifiedCount == 0 ? `content not modfied` : 'Not modified'
      return {
        data: [],
        error: false,
        code: 400,
        msg: msg_
      }
    }
  } catch (e: any) {
    return {
      error: true,
      code: 500,
      msg: e?.stack
    }
  }
}
const getRoleMappingByUuid = async (uuid: string): Promise<any> => {

  let query = { userUuid: uuid?.toString() };
  let db = await clientPromise;
  let userCollection = await db.collection('MST_User_Role_Mapping');
  return userCollection.find(query).toArray();
}
export default {
    createRoleMapping,
    getRoleMapping,
    deleteRoleMapping,
    getRoleMappingByUuid
}