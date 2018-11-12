const Joi = require('joi')
function validateHeaders() {
    return Joi.object({
        authorization: Joi.string().required()
    }).unknown();
};

function validateApiLogin() {
    return {
        username: Joi.string().max(50).required(),
        password: Joi.string().max(100).required()
    }
}

function validateUserPayload() {
    return {
        name: Joi.string().required(),
        icon: Joi.string(),
        email: Joi.string().required(),
        dateBirth: Joi.date(),
        sex: Joi.string(),
        phoneNumber: Joi.string(),
        typeLogin: Joi.string(),
        password: Joi.string().min(3).max(20),
        biography: Joi.string(),
        publishedAt: Joi.date(),
        modifiedAt: Joi.date(),
    };
}
function validateUserPatchPayload() {
    return {
        name: Joi.string(),
        icon: Joi.string(),
        email: Joi.string(),
        dateBirth: Joi.date(),
        sex: Joi.string(),
        phoneNumber: Joi.string(),
        typeLogin: Joi.string(),
        password: Joi.string().min(3).max(20),
        biography: Joi.string(),
        publishedAt: Joi.Date(),
        modifiedAt: Joi.Date(),
    };

}