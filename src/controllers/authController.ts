import httpStatus from 'http-status';
import asyncHandler from "express-async-handler";

import {
  authService, userService, tokenService,
  //  emailService
} from '../services';
import exclude from '../utils/exclude';


const register = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await userService.createUser(userData);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);

  if (user && !user?.error) {
    userData.id = user?.data?.upsertedId
    //const tokens = await tokenService.generateAuthTokens(userData);
    res.status(httpStatus.CREATED).send({ user: userWithoutPassword, });
  } else {
    res.status(httpStatus.BAD_REQUEST).send({ user: {}, msg: user?.msg, status: false });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password, type = '', carrier = '' }: any = req.body;

    const candidate = await authService.loginCandidateWithOtrAndPassword(email, password, type);
    if (candidate && !candidate?.error) {
      const tokens = await tokenService.generateCandidateAuthTokens(candidate);

      res.status(httpStatus.OK).send({ candidate, tokens, status: true });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({ user: {}, msg: candidate?.msg, status: false });
    }

  } catch (e: any) {
    res.status(500).send({ status: false, msg: "please try again" });
  }

});


// const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ user, tokens });
// });

// const logout = asyncHandler(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const refreshTokens = asyncHandler(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

// const forgotPassword = asyncHandler(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const resetPassword = asyncHandler(async (req, res) => {
//   await authService.resetPassword(req.query.token as string, req.body.password);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const sendVerificationEmail = asyncHandler(async (req, res) => {
//   const user = req.user as User;
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
//   await emailService.sendVerificationEmail(user.email, verifyEmailToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const verifyEmail = asyncHandler(async (req, res) => {
//   await authService.verifyEmail(req.query.token as string);
//   res.status(httpStatus.NO_CONTENT).send();
// });

export default {
  register,
  login,
  // logout,
  // refreshTokens,
  // forgotPassword,
  // resetPassword,
  // sendVerificationEmail,
  // verifyEmail
};
