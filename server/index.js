const { config } = require('dotenv');
let swaggerHostConfig = {}
if (process.env.NODE_ENV === 'production') {
    config({ path: './config/.env.prod' });

    swaggerHostConfig.host = process.env.HOST;
    swaggerHostConfig.schemes = ['https'];

} else { config({ path: './config/.env.dev' }) }

const Hapi = require('hapi')
const Boom = require('boom')
const Joi = require('joi')

const Vision = require('vision')
const Inert = require('inert')
const HapiSwagger = require('hapi-swagger')

//All Routes
const loginRoute = require('./api/routes/loginRoute')
const registerRoute = require('./api/routes/registerRoute')

const swaggerConfig = {
    info: {
        title: 'Api viajei',
        version: '1.0',
    },
    lang: 'pt',
    ...swaggerHostConfig
}

//modulo de logs
const winston = require('winston')
const log = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log.json', level: 'info' }),
        new winston.transports.File({ filename: 'error.json', level: 'error' })
    ]
})

const info = log.info
const error = log.error
const logError = (url, params) => {
    error(`Problema em: ${url} com os paramatros: ${JSON.stringify(params)}`)
}
const logRequest = (url, params) => {
    info(`A URL acessada foi: ${url} com os paramatros: ${JSON.stringify(params)}`)
}

const getDataRequest = (request, data) => {
    const myParams = { path, params, query, payload, headers: { host } } = request;
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
}

//importamos o JWT, para gerenciar tokens
const Jwt = require('jsonwebtoken');
const MY_SECRET_KEY = process.env.JWT_KEY;
const USER_ACESS_DATA = {
    username: process.env.USER_USERNAME,
    password: process.env.USER_PASSWORD
}

const HapiJwt = require('hapi-auth-jwt2')

const DatabaseMongoDB = require('./api/models/database')

async function main() {
    try {
        const { userModel } = DatabaseMongoDB.conectar()
        const users = new DatabaseMongoDB(userModel)

        const app = new Hapi.Server({
            port: process.env.PORT,
            routes: {
                cors: {
                    origin: ['*']
                },
            }
        });

        await app.register([
            HapiJwt,
            Vision,
            Inert,
            {
                plugin: HapiSwagger,
                options: swaggerConfig,
            },
        ]);

        app.auth.strategy('jwt', 'jwt', {
            key: MY_SECRET_KEY,
            verifyOptions: {
                algorithms: ['HS256']
            },
            validate: (data, request, callback) => {
                try {
                    const stringLog = getDataRequest(request, data);
                    logRequest(path, { ...stringLog })
                    info(`Token: ${JSON.stringify(data)} em ${new Date().toISOString()}`)
                }
                catch (err) {
                    error(err)
                }
                return {
                    isValid: true
                }
            }
        })
        app.auth.default('jwt')


        app.route([
            loginRoute,
            registerRoute,
        ])


        await app.start()
        info(`Servidor rodando em: ${app.info.port}`)

        //await new Promise(resolve => setTimeout(resolve, 2000));

        return app;
    }
    catch (error) {
        error(`ERRO API ${error.message}`)
    }
}

module.exports = main()



