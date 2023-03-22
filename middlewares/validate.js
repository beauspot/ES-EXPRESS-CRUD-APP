import { check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

// note the validation is running against the mongo db schema.
export const validateTask = [
  check("taskname")
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage("Task name must be between 10 and 50 characters long"),
  check("completed")
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
