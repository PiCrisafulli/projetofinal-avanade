const validate = require('./validates/validates');
module.exports = [{
    method: 'POST',
    path: '/api/register',
    handler: async (request, h) => {
        try {
            const { id } = request.params;
            const result = await users.cadastrar({ _id: id });
            return result;
        }
        catch (err) {
            const stringLog = getDataRequest(request, request.auth.credentials.username);
            logError(stringLog.path, { ...stringLog, err })

            return Boom.internal();
        }
    },
    config: {
        tags: ['api'],
        description: 'Cadastra um usuário',
        notes: 'Faz o cadastro de um usuário',
        validate: {
            headers: validate.validateHeaders,
            failAction: (request, h, err) => {
                throw err;
            },
            payload: validate.validateUserPayload,
        }
    }
}]