import "dotenv/config";
import clientPromise from '../db'
import { roleType, } from '../types'
import { paginate } from '../utils/pagination'


const createRoles = async (roleBody: roleType) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('roles');
    roleBody.roleId = (await role.count()) + 1

    let insertedDoc = await role.updateOne(
      { '$and': [{ roleNameEn: roleBody?.roleNameEn }, { createdBy: roleBody?.createdBy }] },
      { $setOnInsert: roleBody },
      { upsert: true }
    );

    if (insertedDoc && insertedDoc?.upsertedId !== null && insertedDoc?.upsertedCount == 1) {
      return {
        error: false,
        data: insertedDoc?.upsertedId,
        code: 201,
        msg: 'new role is created'
      }
    } else {
      return {
        error: false,
        code: 400,
        msg: 'roleNameEn duplicate'
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

const getRoles = async (query: any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('roles');
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
        msg: 'roles listed',
      }
    } else {
      return {
        data: [],
        error: false,
        code: 400,
        msg: 'roles collection is empty'
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



const deleteRole = async (roleId: string | any, id: string | any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('roles');
    // create a filter for a movie to update
    const filter = { '$and': [{ createdBy: id }, { 'roleId': parseInt(roleId) }] };
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
        msg: 'role is modified'
      }
    } else {
      let msg_ = docs?.matchedCount == 0 ? `no document matched give admin id ${id} and roleId ${roleId}` : docs?.modifiedCount == 0 ? `content not modfied` : 'Not modified'
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
  createRoles,
  getRoles,
  deleteRole
}