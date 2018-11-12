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
      userId: Joi.ObjectId().required(),
      user: {
        name: Joi.string().min(20).required(),
        icon: Joi.string().required(),
        email: Joi.string().min(20).required(),
      }.required(),
      publishedAt: Joi.Date().required(),
      modifiedAt: Joi.Date().required()
    }
  }
  function validatePatchPayload() {
    return {
      userId: Joi.ObjectId(),
      user: {
        name: Joi.string().min(20),
        icon: Joi.string(),
        email: Joi.string().min(20),
      },
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
        path: '/friends',
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
          description: 'Lista amigos paginados',
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
        path: '/friends',
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
          description: 'Cadastra amigo',
          notes: 'Pode cadastrar um amigo',
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
        path: '/friends/{id}',
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
          description: 'Vai remover amigo pelo id',
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
        path: '/friends/{id}',
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
          description: 'Atualiza um amigo parcialmente',
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
        path: '/friends/{id}',
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
          description: 'Obtem um amigo pelo id',
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
