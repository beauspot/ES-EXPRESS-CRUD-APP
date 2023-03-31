import { check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
// import authModel from "../model/authModel.js";

// note the validation is running against the mongo db schema.
export const validateTask = [
  check("taskname")
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage("Task name must be between 10 and 50 characters long"),
  check("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed field must be a boolean"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

export const validateRegistration = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Provide an email address that could be 100 characters long")
    .custom(async (value) => {
      const userEmail = await authModel.findOne({ email: value });
      if (userEmail) {
        return Promise.reject(
          `A user with the email address: ${value} is already registered. Please pick another email`
        );
      }
    }),
  check("username")
    .trim()
    .isAlphanumeric()
    .isLength({ min: 8, max: 17 })
    .withMessage("The email must be between 8 and 17 characters long")
    .custom(async (value) => {
      const user = await authModel.findOne({ username: value });
      if (user) {
        return Promise.reject(
          `A user with username ${value} already exists. Please Pick another username`
        );
      }
    }),
  check("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("The password must be between 20 and 200 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * import { body } from 'express-validator';

// validation middleware function
export const validateTask = [
  body('taskname')
    .notEmpty().withMessage('Task name is required')
    .isLength({ min: 10, max: 50 }).withMessage('Task name should be between 10 and 50 characters'),

  body('completed')
    .isBoolean().withMessage('Completed field should be a boolean'),

  // check for validation errors and throw if there are any
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      errors: extractedErrors
    });
  }
];
 */
