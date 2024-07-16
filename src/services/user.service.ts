'use strict';
// import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import "dotenv/config";
import clientPromise from '../db'
import { roleType, } from '../types'
import { paginate } from '../utils/pagination'
import { ObjectId } from "mongodb";
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: any): Promise<any> => {
  try {
    let db = await clientPromise;
    let encypass = await encryptPassword(userBody.password);
    userBody.password = encypass
    let userCollection = await db.collection('MST_User');
    userBody.userId = (await userCollection.count()) + 1

    let insertedDoc = await userCollection.updateOne(
      { emailId: userBody?.emailId },
      { $setOnInsert: userBody },
      { upsert: true }
    );
  
    if (insertedDoc && insertedDoc?.upsertedId !== null && insertedDoc?.upsertedCount == 1) {
      return {
        error: false,
        data: insertedDoc,
        code: 201,
        msg: 'new user is created  is created'
      }
    } else {
      return {
        error: true,
        code: 400,
        msg: 'user with existing email!'
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

// /**
//  * Query for users
//  * @param {Object} filter - Prisma filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async <Key extends keyof User>(
//   filter: object,
//   options: {
//     limit?: number;
//     page?: number;
//     sortBy?: string;
//     sortType?: 'asc' | 'desc';
//   },
//   keys: Key[] = [
//     'id',
//     'email',
//     'name',
//     'password',
//     'role',
//     'isEmailVerified',
//     'createdAt',
//     'updatedAt'
//   ] as Key[]
// ): Promise<Pick<User, Key>[]> => {
//   const page = options.page ?? 1;
//   const limit = options.limit ?? 10;
//   const sortBy = options.sortBy;
//   const sortType = options.sortType ?? 'desc';
//   const users = await prisma.user.findMany({
//     where: filter,
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
//     skip: page * limit,
//     take: limit,
//     orderBy: sortBy ? { [sortBy]: sortType } : undefined
//   });
//   return users as Pick<User, Key>[];
// };

// /**
//  * Get user by id
//  * @param {ObjectId} id
//  * @param {Array<Key>} keys
//  * @returns {Promise<Pick<User, Key> | null>}
//  */
// const getUserById = async <Key extends keyof User>(
//   id: number,
//   keys: Key[] = [
//     'id',
//     'email',
//     'name',
//     'password',
//     'role',
//     'isEmailVerified',
//     'createdAt',
//     'updatedAt'
//   ] as Key[]
// ): Promise<Pick<User, Key> | null> => {
//   return prisma.user.findUnique({
//     where: { id },
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   }) as Promise<Pick<User, Key> | null>;
// };

// /**
//  * Get user by email
//  * @param {string} email
//  * @param {Array<Key>} keys
//  * @returns {Promise<Pick<User, Key> | null>}
//  */
// const getUserByEmail = async <Key extends keyof User>(
//   email: string,
//   keys: Key[] = [
//     'id',
//     'email',
//     'name',
//     'password',
//     'role',
//     'isEmailVerified',
//     'createdAt',
//     'updatedAt'
//   ] as Key[]
// ): Promise<Pick<User, Key> | null> => {
//   return prisma.user.findUnique({
//     where: { email },
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   }) as Promise<Pick<User, Key> | null>;
// };

// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async <Key extends keyof User>(
//   userId: number,
//   updateBody: Prisma.UserUpdateInput,
//   keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
// ): Promise<Pick<User, Key> | null> => {
//   const user = await getUserById(userId, ['id', 'email', 'name']);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   const updatedUser = await prisma.user.update({
//     where: { id: user.id },
//     data: updateBody,
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   });
//   return updatedUser as Pick<User, Key> | null;
// };

// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId: number): Promise<User> => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await prisma.user.delete({ where: { id: user.id } });
//   return user;
// };

const getUserByUuid = async (email: string): Promise<any> => {

  let query = { emailId: email }
  let db = await clientPromise;
  let userCollection = await db.collection('MST_User');
  return userCollection.find(query).toArray();
}
export default {
  createUser,
  getUserByUuid
  //   queryUsers,
  //   getUserById,
  //   getUserByEmail,
  //   updateUserById,
  //   deleteUserById
};
