import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import userService from './user.service';
import ApiError from '../utils/ApiError';

import { AuthTokensResponse } from '../types/response';

/**
 * Generate token
 * @param {number} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  user: any,
  expires: Moment,
  type: any,
  secret = config.jwt.secret
): string => {
  const payload = {
    sub: user,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};


/**
 * Generate token
 * @param {number} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateCandidateToken = (
  user: any,
  expires: Moment,
  type: any,
  secret = config.jwt.secret
): string => {
  const payload = {
    sub: user,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};
/**
 * Save a token
 * @param {string} token
 * @param {number} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: number,
  expires: Moment,
  type: any,
  blacklisted = false
): Promise<any> => {
  const createdToken:any=90;
  // prisma.token.create({
  //   data: {
  //     token,
  //     userId: userId,
  //     expires: expires.toDate(),
  //     type,
  //     blacklisted
  //   }
  // });
  return createdToken;
};


const saveCandidateToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: any,
  blacklisted = false
): Promise<any> => {
  const createdToken=90;
  //  = prisma.candidateToken.create({
  //   data: {
  //     token,
  //     candidateId: userId,
  //     expires: expires.toDate(),
  //     type,
  //     blacklisted
  //   }
  // });
  return createdToken;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: any): Promise<any> => {
  const payload = jwt.verify(token, config.jwt.secret);
  const userId = Number(payload.sub);
  const tokenData = 90;
  // await prisma.token.findFirst({
  //   where: { token, type, userId, blacklisted: false }
  // });
  if (!tokenData) {
    throw new Error('Token not found');
  }
  return tokenData;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthTokensResponse>}
 */
const generateAuthTokens = async (user:any): Promise<AuthTokensResponse> => {

  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user, accessTokenExpires, config.jwt.secret);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user, refreshTokenExpires, config.jwt.secret);
  //await saveToken(refreshToken, user.id, refreshTokenExpires, config.jwt.secret);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};


/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthTokensResponse>}
 */
const generateCandidateAuthTokens = async (candidate: any): Promise<AuthTokensResponse> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateCandidateToken(candidate, accessTokenExpires, config.jwt.secret);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateCandidateToken(candidate, refreshTokenExpires, config.jwt.secret);
  await saveCandidateToken(refreshToken, candidate, refreshTokenExpires, config.jwt.secret);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};



/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
// const generateResetPasswordToken = async (email: string): Promise<string> => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
//   }
//   const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
//   const resetPasswordToken = generateToken(user.id as number, expires, TokenType.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id as number, expires, TokenType.RESET_PASSWORD);
//   return resetPasswordToken;
// };

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
// const generateVerifyEmailToken = async (user: { id: number }): Promise<string> => {
//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user.id, expires, TokenType.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);
//   return verifyEmailToken;
// };

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
//   generateResetPasswordToken,
//   generateVerifyEmailToken,
  generateCandidateAuthTokens
};
