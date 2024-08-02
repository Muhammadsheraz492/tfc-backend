import Joi from 'joi';
export const BalanceValidationSchema=Joi.number().min(0).required()