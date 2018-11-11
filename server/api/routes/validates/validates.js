function validateHeaders() {
    return Joi.object({
        authorization: Joi.string().required()
    }).unknown();
};

function validateUserPayload() {
    return {
        name: Joi.string().required(),
        icon: Joi.string().required(),
        email: Joi.string().required(),
        dateBirth: Joi.Date().required(),
        sex: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        typeLogin: Joi.string().required(),
        password: Joi.string().min(3).max(20).required(),
        biography: Joi.string().required(),
        publishedAt: Joi.Date().required(),
        modifiedAt: Joi.Date().required(),
    };
}
function validateUserPatchPayload() {
    return {
        name: Joi.string(),
        icon: Joi.string(),
        email: Joi.string(),
        dateBirth: Joi.Date(),
        sex: Joi.string(),
        phoneNumber: Joi.string(),
        typeLogin: Joi.string(),
        password: Joi.string().min(3).max(20),
        biography: Joi.string(),
        publishedAt: Joi.Date(),
        modifiedAt: Joi.Date(),
    };

}