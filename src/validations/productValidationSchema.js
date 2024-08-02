import Joi from 'joi';

export const productValidationSchema = Joi.object({
    title: Joi.string().required(),
    userId: Joi.string().length(24).hex().required(),
    status: Joi.string().valid('pending', 'approved', 'rejected').default('pending'),
    cost: Joi.number().min(0).required(),
    numberOfPieces: Joi.number().min(0).required(),
});

export const StatusValidationSchema=Joi.string().valid('pending', 'approved', 'rejected')