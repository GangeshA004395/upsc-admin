import "dotenv/config";
import clientPromise from '../db'
import { designationsType } from '../types'
import { paginate } from '../utils/pagination'


const createDesignation = async (roleBody: designationsType) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('designations');
    roleBody.designationId = (await role.count()) + 1

    let insertedDoc = await role.updateOne(
      { '$and': [{ designationNameEn: roleBody?.designationNameEn }, { createdBy: roleBody?.createdBy }] },
      { $setOnInsert: roleBody },
      { upsert: true }
    );

    if (insertedDoc && insertedDoc?.upsertedId !== null && insertedDoc?.upsertedCount == 1) {
      return {
        error: false,
        data: insertedDoc?.upsertedId,
        code: 201,
        msg: 'new designation is created'
      }
    } else {
      return {
        error: false,
        code: 400,
        msg: 'designationNameEn duplicate'
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

const getDesignation = async (query: any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('designations');
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



const deleteDesignation = async (designationId: string | any, id: string | any) => {
  try {
    let db = await clientPromise;
    let role = await db.collection('designations');
    // create a filter for a movie to update
    const filter = { '$and': [{ createdBy: id }, { 'designationId': parseInt(designationId) }] };
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
        msg: 'designation is modified'
      }
    } else {
      let msg_ = docs?.matchedCount == 0 ? `no document matched give admin id ${id} and roleId ${designationId}` : docs?.modifiedCount == 0 ? `content not modfied` : 'Not modified'
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
    createDesignation,
    getDesignation,
    deleteDesignation
}