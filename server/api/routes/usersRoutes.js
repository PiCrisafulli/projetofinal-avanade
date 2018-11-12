module.exports = async () => {
  const Model = require('../models/users');

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
  const swaggerConfig = {
    info: {
      title: 'Api de Publicações',
      version: '1.0',
    },
    lang: 'pt',
    ...swaggerHostConfig
  }

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

  const Jwt = require('jsonwebtoken');
  const SECRET_KEY = process.env.JWT_KEY;
  const USUARIO = {
    username: process.env.USER_USERNAME,
    password: process.env.USER_PASSWORD
  }

  const HapiJwt = require('hapi-auth-jwt2')

  const Database = require('../database')

  function validateHeaders() {
    return Joi.object({
      authorization: Joi.string().required()
    }).unknown();
  }

  function validatePayload() {
    return {
      name: Joi.string().min(20).required(),
      icon: Joi.string().required(),
      email: Joi.string().min(20).required(),
      dateBirth: Joi.Date().required(),
      sex: Joi.string().min(1).required(),
      phoneNumber: Joi.string().min(8).required(),
      typeLogin: Joi.string().min(1).required(),
      password: Joi.string().min(6).required(),
      biography: Joi.string().min(50).required(),
      publishedAt: Joi.Date().required(),
      modifiedAt: Joi.Date().required()
    }
  }
  function validatePatchPayload() {
    return {
      name: Joi.string().min(20),
      icon: Joi.string(),
      email: Joi.string().min(20),
      dateBirth: Joi.Date(),
      sex: Joi.string().min(1),
      phoneNumber: Joi.string().min(8),
      typeLogin: Joi.string().min(1),
      password: Joi.string().min(6),
      biography: Joi.string().min(50),
      publishedAt: Joi.Date(),
      modifiedAt: Joi.Date()
    }
  }
  try {
    Database.conectar()
    const database = new Database(Model)

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
      key: SECRET_KEY,
      verifyOptions: {
        algorithms: ['HS256']
      },
      validate: (dado, request, callback) => {
        try {
          const stringLog = obterDadoRequest(request, dado);
          logRequest(path, { ...stringLog })
          info(`Token: ${JSON.stringify(dado)} em ${new Date().toISOString()}`)
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
      {
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
          try {
            const { limitar, ignorar } = request.query;
            const resultado = await database.listar({}, {
              limitar, ignorar
            })
            return resultado
          }
          catch (err) {
            const stringLog = obterDadoRequest(request, request.auth.credentials.username);
            logError(stringLog.path, { ...stringLog, err })
            return Boom.internal();
          }
        },
        config: {
          tags: ['api'],
          description: 'Lista usuários paginados',
          notes: 'Pode paginar, com limte e itens a ignorar',
          validate: {
            headers: validateHeaders(),
            failAction: (request, h, err) => {
              throw err;
            },
            query: {
              limitar: Joi.number().integer().default(10),
              ignorar: Joi.number().integer().default(0)
            }
          }
        }
      },
      {
        method: 'POST',
        path: '/users',
        handler: async (request, h) => {
          try {
            const item = request.payload;
            const resultado = await database.cadastrar(item);
            return resultado;

          }
          catch (err) {
            const stringLog = obterDadoRequest(request, request.auth.credentials.username);
            logError(stringLog.path, { ...stringLog, err })

            return Boom.internal();
          }
        },
        config: {
          tags: ['api'],
          description: 'Cadastra usuário',
          notes: 'Pode cadastrar um usuário',
          validate: {
            headers: validateHeaders(),
            failAction: (request, h, err) => {
              throw err;
            },
            payload: validatePayload(),
          }
        }
      },
      {
        path: '/users/{id}',
        method: 'DELETE',
        handler: async (request, h) => {
          try {
            const { id } = request.params;
            const result = await database.remover(id);
            return result;
          }
          catch (error) {
            console.error('DEU RUIM', error);
            return Boom.internal();
          }
        },
        config: {
          tags: ['api'],
          description: 'Vai remover usuário pelo id',
          notes: 'O id deve ser valido',
          validate: {
            headers: validateHeaders(),
            failAction: (request, h, err) => { throw err },
            params: {
              id: Joi.string().max(200).required(),
            }
          }
        }
      },
      {
        path: '/users/{id}',
        method: 'PATCH',
        handler: async (request, h) => {
          try {
            const { id } = request.params;
            const content = request.payload;
            const result = await database.atualizar(id, content);
            return result;
          }
          catch (err) {
            const stringLog = obterDadoRequest(request, request.auth.credentials.username);
            logError(stringLog.path, { ...stringLog, err })

            return Boom.internal()
          }
        },
        config: {
          tags: ['api'],
          description: 'Atualiza um usuário parcialmente',
          notes: 'deve passar um objeto valido',
          validate: {
            headers: validateHeaders(),
            failAction: (request, h, err) => { throw err },
            payload: validatePatchPayload(),
            params: {
              id: Joi.string().min(3).max(200),
            }
          }
        }
      },
      {
        path: '/users/{id}',
        method: 'GET',
        handler: async (request, h) => {
          try {
            const { id } = request.params;
            const result = await database.listar({ _id: id });
            return result;
          }
          catch (err) {
            const stringLog = obterDadoRequest(request, request.auth.credentials.username);
            logError(stringLog.path, { ...stringLog, err })

            return Boom.internal();
          }
        },
        config: {
          tags: ['api'],
          description: 'Obtem um usuário pelo id',
          notes: 'O id deve ser valido',
          validate: {
            headers: validateHeaders(),
            failAction: (request, h, err) => { throw err },
            params: {
              id: Joi.string().max(200).required(),
            }
          }
        }
      }
    ])
    await app.start()
    info(`Servidor rodando em: ${app.info.port}`)

    return app;
  }
  catch (error) {
    console.error(`ERRO API ${error.message}`)
  }
}
