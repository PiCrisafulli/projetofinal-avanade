const validate = require('./validates/validates');
const Boom = require('boom')
module.exports = [{
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
        const { username, password } = request.payload
        if (username !== USER_ACESS_DATA.username || password !== USER_ACESS_DATA.password)
            return Boom.unauthorized('Usuário não autorizado')
        const dataToken = {
            username,
        }
        const token = Jwt.sign(dataToken, MY_SECRET_KEY)

        return { token }
    },
    config: {
        auth: false,
        tags: ['api'],
        description: 'Deve gerar um token para o usuário',
        validate: {
            payload: validate.validateApiLogin,
        }
    }
},
{
    method: 'GET',
    path: '/api/login/{id}',
    handler: async (request, h) => {
        try {
            const item = request.payload;
            const result = await users.cadastrar(item);
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
        description: 'Verifica um usuário',
        notes: 'Verifica um usuário de acordo com seu id',
        validate: {
            headers: validate.validateHeaders,
            failAction: (request, h, err) => {
                throw err;
            },
            payload: validate.validateUserPayload,
        }
    }
},

]