import "dotenv/config";
import clientPromise from '../../db'
import {  employeeType } from '../../types'
import { paginate } from '../../utils/pagination'


const createUserType = async (roleBody: employeeType) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('userstypes');
    roleBody.userTypeId = (await role.count()) + 1

    let insertedDoc = await role.updateOne(
      { '$and': [{ userTypeNameEn: roleBody?.userTypeNameEn }, { createdBy: roleBody?.createdBy }] },
      { $setOnInsert: roleBody },
      { upsert: true }
    );

    if (insertedDoc && insertedDoc?.upsertedId !== null && insertedDoc?.upsertedCount == 1) {
      return {
        error: false,
        data: insertedDoc?.upsertedId,
        code: 201,
        msg: 'new user type is created'
      }
    } else {
      return {
        error: false,
        code: 400,
        msg: 'userTypeNameEn duplicate'
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

const getUserTypes = async (query: any) => {
  try {
    let db = await clientPromise;
    let departments = await db.collection('userstypes');

    let filters: any = { createdBy: query.id };

    if (query?.isActive && query?.id) {
      filters = {
        '$and': [
          { 'createdBy': query.id},
          { 'isActive': query.isActive },
        ]
      }
    }

    let pagData = await paginate(departments, parseInt(query.pageno), parseInt(query.perpage), filters)
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
        msg: 'User Typs list',
      }
    } else {
      return {
        data: [],
        error: false,
        code: 400,
        msg: 'User Typs collection is empty'
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



const deleteUserType = async (userTypeId: string | any, id: string | any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('userstypes');
    console.log("userTypeId", userTypeId)
    // create a filter for a movie to update
    const filter = { '$and': [{ createdBy: id }, { 'userTypeId': parseInt(userTypeId) }] };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: false };
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        isActive: 'N'
      },
    };
    console.log("filter",filter)
    let docs = await role.updateOne(filter, updateDoc, options);;

    if (docs && docs?.modifiedCount == 1) {
      return {
        data: docs,
        error: false,
        code: 200,
        msg: 'Department is modified'
      }
    } else {
      let msg_ = docs?.matchedCount == 0 ? `no document matched give admin id ${id} and department ${userTypeId}` : docs?.modifiedCount == 0 ? `content not modfied` : 'Not modified'
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
export default {
    createUserType,
    getUserTypes,
    deleteUserType
}