const { config } = require('dotenv');
let swaggerHostConfig = {};

config({ path: './api/config/.env.dev' });
console.log(config);
const Joi = require('joi');
const Hapi = require('hapi');

const Vision = require('vision');
const Inert = require('inert');
const HapiSwagger = require('hapi-swagger');
//const validate = require('./validates/validates');
const Boom = require('boom');

function validateHeaders() {
    return Joi.object({
        authorization: Joi.string().required()
    }).unknown();
}

function validateApiLogin() {
    return {
        username: Joi.string()
            .max(50)
            .required(),
        password: Joi.string()
            .max(100)
            .required()
    };
}
/* function validateUserPayload() {
    return {
        name: Joi.string().required,
        icon: Joi.string().required,
        email: Joi.string().required,
        dateBirth: Joi.date().required,
        sex: Joi.string().required,
        phoneNumber: Joi.string().required,
        typeLogin: Joi.string().required,
        password: Joi.string().min(3).max(20).required,
        biography: Joi.string().required,
        publishedAt: Joi.date().required,
        modifiedAt: Joi.date().required,
    };
} */

function validateUserPayload() {
    return {
        name: Joi.string(),
        icon: Joi.string(),
        email: Joi.string(),
        dateBirth: Joi.date(),
        sex: Joi.string(),
        phoneNumber: Joi.string(),
        typeLogin: Joi.string(),
        password: Joi.string()
            .min(3)
            .max(20),
        biography: Joi.string(),
        publishedAt: Joi.date(),
        modifiedAt: Joi.date()
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
        password: Joi.string()
            .min(3)
            .max(20),
        biography: Joi.string(),
        publishedAt: Joi.date(),
        modifiedAt: Joi.date()
    };
}

//All Routes
//const loginRoute = require('./api/routes/loginRoute')
//const registerRoute = require('./api/routes/registerRoute')

const swaggerConfig = {
    info: {
        title: 'Api viajei',
        version: '1.0'
    },
    lang: 'pt',
    ...swaggerHostConfig
};

//modulo de logs
const winston = require('winston');
const log = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log.json', level: 'info' }),
        new winston.transports.File({ filename: 'error.json', level: 'error' })
    ]
});

const info = log.info;
const error = log.error;
const logError = (url, params) => {
    error(`Problema em: ${url} com os paramatros: ${JSON.stringify(params)}`);
};
const logRequest = (url, params) => {
    info(
        `A URL acessada foi: ${url} com os paramatros: ${JSON.stringify(params)}`
    );
};

const getDataRequest = (request, data) => {
    const myParams = ({
        path,
        params,
        query,
        payload,
        headers: { host }
    } = request);
    const stringLog = {
        path,
        params,
        query,
        payload,
        host,
        username: data.username,
        at: new Date().toISOString()
    };
    return stringLog;
};

//importamos o JWT, para gerenciar tokens
const Jwt = require('jsonwebtoken');
const MY_SECRET_KEY = process.env.JWT_KEY;
const USER_ACESS_DATA = {
    username: process.env.USER_USERNAME,
    password: process.env.USER_PASSWORD
};
console.log(USER_ACESS_DATA);

const HapiJwt = require('hapi-auth-jwt2');

const DatabaseMongoDB = require('./api/database');

async function main() {
    try {
        const { userModel } = DatabaseMongoDB.conectar();
        const users = new DatabaseMongoDB(userModel);

        const app = new Hapi.Server({
            port: 3000,
            routes: {
                cors: {
                    origin: ['*']
                }
            }
        });

        await app.register([
            HapiJwt,
            Vision,
            Inert,
            {
                plugin: HapiSwagger,
                options: swaggerConfig
            }
        ]);

        app.auth.strategy('jwt', 'jwt', {
            key: MY_SECRET_KEY,
            verifyOptions: {
                algorithms: ['HS256']
            },
            validate: (data, request, callback) => {
                try {
                    const stringLog = getDataRequest(request, data);
                    logRequest(path, { ...stringLog });
                    info(
                        `Token: ${JSON.stringify(
                            data
                        )} em ${new Date().toISOString()}`
                    );
                } catch (err) {
                    error(err);
                }
                return {
                    isValid: true
                };
            }
        });
        app.auth.default('jwt');

        app.route([
            //loginRoute,
            // registerRoute,
            {
                method: 'POST',
                path: '/login',
                handler: async (request, h) => {
                    const { username, password } = request.payload;
                    if (
                        username !== USER_ACESS_DATA.username ||
                        password !== USER_ACESS_DATA.password
                    )
                        return Boom.unauthorized('Usuário não autorizado');

                    console.log(USER_ACESS_DATA.username);
                    const dataToken = {
                        username
                    };
                    const token = Jwt.sign(dataToken, MY_SECRET_KEY);

                    return { token };
                },
                config: {
                    auth: false,
                    tags: ['api'],
                    description: 'Deve gerar um token para o usuário',
                    validate: {
                        payload: validateApiLogin()
                    }
                }
            },
            {
                path: '/api/login/{email}',
                method: 'GET',
                handler: async (request, h) => {
                    try {
                        const { email } = request.params;
                        const result = await users.listar({
                            email: email
                        });
                        return result;
                    } catch (err) {
                        const item = getDataRequest(
                            request,
                            request.auth.credentials.username
                        );
                        logError(item.path, { ...item, err });
                        return Boom.internal();
                    }
                },
                config: {
                    tags: ['api'],
                    description: 'Obtém o usuário desejado',
                    notes: 'Pode obter o usuário desejado',

                    validate: {
                        headers: validateHeaders(),
                        failAction: (request, h, error) => {
                            throw error;
                        },
                        params: {
                            id: Joi.string()
                                .max(200)
                                .required()
                        }
                    }
                }
            },
            {
                method: 'POST',
                path: '/api/register',
                handler: async (request, h) => {
                    try {
                        const item = request.payload;
                        console.log(item);
                        const result = await users.cadastrar(item);
                        return result;
                    } catch (error) {
                        console.error('DEU RUIM', error);
                        return Boom.internal();
                    }
                },
                config: {
                    tags: ['api'],
                    description: 'Cadastra um usuário',
                    notes: 'Faz o cadastro de um usuário',
                    validate: {
                        headers: validateHeaders(),
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: validateUserPayload()
                    }
                }
            },
            {
                method: 'GET',
                path: '/api/users',
                handler: async (request, h) => {
                    try {
                        const { limitar, ignorar } = request.query;
                        const resultado = await users.listar(
                            {},
                            {
                                limitar,
                                ignorar
                            }
                        );
                        return resultado;
                    } catch (err) {
                        const stringLog = getDataRequest(
                            request,
                            request.auth.credentials.username
                        );
                        logError(stringLog.path, { ...stringLog, err });

                        return Boom.internal();
                    }
                },
                config: {
                    tags: ['api'],
                    description: 'Lista usuários paginados',
                    notes: 'Pode paginar, com limite e itens a ignorar',
                    validate: {
                        headers: validateHeaders(),
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        query: {
                            limitar: Joi.number()
                                .integer()
                                .default(10),
                            ignorar: Joi.number()
                                .integer()
                                .default(0)
                        }
                    }
                }
            },
            {
                path: '/api/users/{id}',
                method: 'PATCH',
                handler: async (request, h) => {
                    try {
                        const { id } = request.params;
                        const conteudo = request.payload;
                        const result = await users.atualizar(id, conteudo);
                        return result;
                    } catch (err) {
                        const stringLog = obterDadoRequest(
                            request,
                            request.auth.credentials.username
                        );
                        logError(stringLog.path, { ...stringLog, err });

                        return Boom.internal();
                    }
                },
                config: {
                    tags: ['api'],
                    description: 'Alterar usuário',
                    notes: 'Pode alterar qualquer dado do usuário',
                    validate: {
                        headers: validateHeaders(),
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: validateUserPatchPayload(),
                        params: {
                            id: Joi.string()
                                .min(3)
                                .max(200)
                        }
                    }
                }
            }
        ]);

        await app.start();
        info(`Servidor rodando em: ${app.info.port}`);

        await new Promise(resolve => setTimeout(resolve, 2000));

        return app;
    } catch (err) {
        console.log(err);
    }
}

module.exports = main();
// [ ROUTES /// POSTS ] //
const appPosts = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appComments = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appFriends = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appPlaces = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appUsers = require('./api/routes/postsRoutes');

module.exports = appPosts();
module.exports = appComments();
module.exports = appFriends();
module.exports = appPlaces();
module.exports = appUsers();
