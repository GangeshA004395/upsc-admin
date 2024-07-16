import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import userRoleMappingServices from './userrole.mapping.services'
// import candidateService from './candidate/candidate.service';

import ApiError from '../utils/ApiError';

import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import { AuthTokensResponse } from '../types/response';
import exclude from '../utils/exclude';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
// const loginUserWithEmailAndPassword = async (
//   email: string,
//   password: string
// ): Promise<Omit<User, 'password'>> => {
//   const user = await userService.getUserByEmail(email, [
//     'id',
//     'email',
//     'name',
//     'password',
//     'role',
//     'isEmailVerified',
//     'createdAt',
//     'updatedAt'
//   ]);
//   if (!user || !(await isPasswordMatch(password, user.password as string))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//   }
//   return exclude(user, ['password']);
// };



/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */

const loginCandidateWithOtrAndPassword = async (
  email: string,
  password: string,
  type: string
): Promise<any> => {
  try {
    const candidate = await userService.getUserByUuid(email);

    if ( !candidate || !(Array.isArray(candidate) && candidate.length > 0) || !(await isPasswordMatch(password, candidate[0].password as string))) {
      return {
        error: true,
        code: httpStatus.UNAUTHORIZED,
        msg: 'Incorrect registrationid or password'
      }
    }
    if(candidate && Array.isArray(candidate) && candidate.length > 0) {
      let accessLevel = await userRoleMappingServices.getRoleMappingByUuid(candidate[0]?._id);
      if(accessLevel && Array.isArray(accessLevel) && accessLevel.length > 0) {
       let { _id, userRoleMasterId, 
        createdBy,
        isActive,
        modifiedBy,
        modifiedDt,
        moduleId,
        moduleNameEN,
        moduleSubId,
        moduleSubNameEn,
        roleId,
        roleIdNameEn,
        createdDt
      } =  accessLevel[0]
        candidate[0].meta = {
          role_mapping_id: _id,
          userRoleMasterId,
          createdBy,
          createdDt,
          isActive,
          modifiedBy,
          modifiedDt,
          moduleId,
          moduleNameEN,
          moduleSubId,
          moduleSubNameEn,
          roleId,
          roleIdNameEn
        }
      }
      return {
        error: false,
        data: exclude(candidate[0], ['password']),
        code: 201,
        msg: 'user logged in'
      }
    }
    
  } catch(e:any) {
    return {
      error: true,
      data: {},   
      code: 201,
      msg: e.stack
    }
  }
 
};


// const loginCandidateWithotp = async (
//   carrier: string,
//   type: string
// ): Promise<Pick<Cmm, any> | null> => {
//   let password = ''
//   const candidate = await candidateService.getCandidateByOtrid(carrier, [
//     'id',
//     'email',
//     'password',
//     'registrationid',
//     'mobile',
//     'candidate_name' 
//   ]);
//   if (!candidate || !(await isPasswordMatch(password, candidate.password as string))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect registrationid or password');
//   }
//   return exclude(candidate, ['password']);
// };



/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
// const logout = async (refreshToken: string): Promise<void> => {
//   const refreshTokenData = await prisma.token.findFirst({
//     where: {
//       token: refreshToken,
//       type: TokenType.REFRESH,
//       blacklisted: false
//     }
//   });
//   if (!refreshTokenData) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
//   }
//   await prisma.token.delete({ where: { id: refreshTokenData.id } });
// };

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
// const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
//   try {
//     const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
//     const { userId } = refreshTokenData;
//     await prisma.token.delete({ where: { id: refreshTokenData.id } });
//     return tokenService.generateAuthTokens({ id: userId });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
// const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
//   try {
//     const resetPasswordTokenData = await tokenService.verifyToken(
//       resetPasswordToken,
//       TokenType.RESET_PASSWORD
//     );
//     const user = await userService.getUserById(resetPasswordTokenData.userId);
//     if (!user) {
//       throw new Error();
//     }
//     const encryptedPassword = await encryptPassword(newPassword);
//     await userService.updateUserById(user.id, { password: encryptedPassword });
//     await prisma.token.deleteMany({ where: { userId: user.id, type: TokenType.RESET_PASSWORD } });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
//   }
// };

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
// const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
//   try {
//     const verifyEmailTokenData = await tokenService.verifyToken(
//       verifyEmailToken,
//       TokenType.VERIFY_EMAIL
//     );
//     await prisma.token.deleteMany({
//       where: { userId: verifyEmailTokenData.userId, type: TokenType.VERIFY_EMAIL }
//     });
//     await userService.updateUserById(verifyEmailTokenData.userId, { isEmailVerified: true });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
//   }
// };

export default {
  // loginUserWithEmailAndPassword,
  loginCandidateWithOtrAndPassword,
  isPasswordMatch,
  encryptPassword,
  // logout,
  // refreshAuth,
  // resetPassword,
  // verifyEmail,
  // loginCandidateWithotp
};
