module.exports = async () => {
      const Model = require('../models/posts');

      const { config } = require('dotenv');

      let swaggerHostConfig = {};
      if (process.env.NODE_ENV === 'production') {
            config({ path: './config/.env.prod' });

            swaggerHostConfig.host = process.env.HOST;
            swaggerHostConfig.schemes = ['https'];
      } else {
            config({ path: './config/.env.dev' });
      }

      const Hapi = require('hapi');
      const Boom = require('boom');
      const Joi = require('joi');

      const Vision = require('vision');
      const Inert = require('inert');
      const HapiSwagger = require('hapi-swagger');
      const swaggerConfig = {
            info: {
                  title: 'Api de Publicações',
                  version: '1.0'
            },
            lang: 'pt',
            ...swaggerHostConfig
      };

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
                  `A URL acessada foi: ${url} com os paramatros: ${JSON.stringify(
                        params
                  )}`
            );
      };

      const obterDadoRequest = (request, dado) => {
            const meusParams = ({
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
                  usernama: dado.username,
                  at: new Date().toISOString()
            };
            return stringLog;
      };

      const Jwt = require('jsonwebtoken');
      const SECRET_KEY = process.env.JWT_KEY;
      const USER_ACESS_DATA = {
            username: process.env.USER_USERNAME,
            password: process.env.USER_PASSWORD
      };

      const HapiJwt = require('hapi-auth-jwt2');

      const Database = require('../database');

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
      try {
            Database.conectar();
            const database = new Database(Model);

            const app = new Hapi.Server({
                  port: process.env.PORT,
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
                  key: SECRET_KEY,
                  verifyOptions: {
                        algorithms: ['HS256']
                  },
                  validate: (dado, request, callback) => {
                        try {
                              const stringLog = obterDadoRequest(request, dado);
                              logRequest(path, { ...stringLog });
                              info(
                                    `Token: ${JSON.stringify(
                                          dado
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
                              const token = Jwt.sign(dataToken, SECRET_KEY);

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
                  }
            ]);
            await app.start();
            info(`Servidor rodando em: ${app.info.port}`);

            return app;
      } catch (error) {
            console.error(`ERRO API ${error.message}`);
      }
};
