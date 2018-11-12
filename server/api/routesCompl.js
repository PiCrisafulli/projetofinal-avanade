module.exports = () => {
    const { config } = require('dotenv');

    let swaggerHostConfig = {}
    if (process.env.NODE_ENV === 'production') {
        config({ path: './config/.env.prod' });

        swaggerHostConfig.host = process.env.HOST;
        swaggerHostConfig.schemes = ['https'];

    } else { config({ path: './config/.env.dev' }) }

    const Hapi = require('hapi')
    const Boom = require('boom')
    const Joi = require('joi') //apos instalar, adicionar o objeto config

    const Vision = require('vision')
    const Inert = require('inert')
    const HapiSwagger = require('hapi-swagger')
    const swaggerConfig = {
        info: {
            title: 'Api de Publicações',
            version: '1.0',
        },
        lang: 'pt',
        ...swaggerHostConfig
    }

    //importamos o modulo de logs
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

    const obterDadoRequest = (request, dado) => {
        const meusParams = { path, params, query, payload, headers: { host } } = request;
        const stringLog = {
            path,
            params,
            query,
            payload,
            host,
            usernama: dado.username,
            at: new Date().toISOString()
        };
        return stringLog;
    }

    //importamos o JWT, para gerenciar tokens
    const Jwt = require('jsonwebtoken');
    const MINHA_CHAVE_SECRETA = process.env.JWT_KEY;
    const USUARIO = {
        username: process.env.USER_USERNAME,
        password: process.env.USER_PASSWORD
    }

    //importamos o módulo para controlar a autenticação nas rotas
    const HapiJwt = require('hapi-auth-jwt2')

    const Database = require('./database')
}

module.exports = function validateHeaders() {
    return Joi.object({
        authorization: Joi.string().required()
    }).unknown();
}

module.exports = function validatePostPayload(item) {
    return item
}

module.exports = function validatePatchPayload(item) {
    return item
}