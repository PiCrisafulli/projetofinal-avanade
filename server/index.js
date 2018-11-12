async function main() {
   const postsModel = require('./api/models/posts');
   const usersModel = require('./api/models/users');
   const commentsModel = require('./api/models/comments');
   const placesModel = require('./api/models/places');
   const friendsModel = require('./api/models/friends');

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

   const Database = require('./api/database');

   function validateHeaders() {
      return Joi.object({
         authorization: Joi.string().required()
      }).unknown();
   }

   //Login
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

   //Posts
   function validatePostPayload() {
      return {
         description: Joi.string()
            .min(20)
            .required(),
         link: Joi.string()
            .min(5)
            .max(200),
         publishedAt: Joi.date().required(),
         user: Joi.object()
            .keys({
               name: Joi.string().required(),
               icon: Joi.string().required(),
               email: Joi.string().required()
            })
            .required(),
         images: Joi.array().required(),
         videos: Joi.array().required(),
         comments: Joi.array().required(),
         likes: Joi.number().required()
      };
   }
   function validatePostPatchPayload() {
      return {
         description: Joi.string().min(20),
         link: Joi.string()
            .min(5)
            .max(200),
         publishedAt: Joi.date(),
         user: Joi.object().keys({
            name: Joi.string(),
            icon: Joi.string(),
            email: Joi.string()
         }),
         images: Joi.array(),
         videos: Joi.array(),
         comments: Joi.array(),
         likes: Joi.number()
      };
   }

   //Users
   function validateUserPayload() {
      return {
         name: Joi.string()
            .min(5)
            .required(),
         icon: Joi.string(),
         email: Joi.string()
            .min(20)
            .required(),
         dateBirth: Joi.date(),
         sex: Joi.string().min(1),
         phoneNumber: Joi.string().min(8),
         typeLogin: Joi.string()
            .min(1)
            .required(),
         password: Joi.string()
            .min(6)
            .required(),
         biography: Joi.string().min(50),
         publishedAt: Joi.date(),
         modifiedAt: Joi.date()
      };
   }
   function validateUserPatchPayload() {
      return {
         name: Joi.string().min(20),
         icon: Joi.string(),
         email: Joi.string().min(20),
         dateBirth: Joi.date(),
         sex: Joi.string().min(1),
         phoneNumber: Joi.string().min(8),
         typeLogin: Joi.string().min(1),
         password: Joi.string().min(6),
         biography: Joi.string().min(50),
         publishedAt: Joi.date(),
         modifiedAt: Joi.date()
      };
   }

   //Comment
   function validateCommentPayload() {
      return {
         postId: Joi.string().required(),
         text: Joi.string()
            .min(20)
            .required(),
         user: Joi.object()
            .keys({
               name: Joi.string()
                  .min(20)
                  .required(),
               icon: Joi.string().required(),
               email: Joi.string()
                  .min(20)
                  .required()
            })
            .required(),
         publishedAt: Joi.date().required(),
         modifiedAt: Joi.date().required()
      };
   }
   function validateCommentPatchPayload() {
      return {
         postId: Joi.string(),
         text: Joi.string().min(20),
         user: Joi.object()
            .keys({
               name: Joi.string().min(20),
               icon: Joi.string(),
               email: Joi.string().min(20)
            })
            .required(),
         publishedAt: Joi.date(),
         modifiedAt: Joi.date()
      };
   }

   //Place
   function validatePlacePayload() {
      return {
         userId: Joi.string().required(),
         user: Joi.object()
            .keys({
               name: Joi.string()
                  .min(20)
                  .required(),
               icon: Joi.string().required(),
               email: Joi.string()
                  .min(20)
                  .required()
            })
            .required(),
         country: Joi.string()
            .min(20)
            .required(),
         state: Joi.string()
            .min(20)
            .required(),
         city: Joi.string()
            .min(20)
            .required(),
         comments: Joi.string()
            .min(20)
            .required(),
         avaliation: Joi.string()
            .min(20)
            .required(),
         publishedAt: Joi.date().required(),
         modifiedAt: Joi.date().required()
      };
   }
   function validatePlacePatchPayload() {
      return {
         userId: Joi.string(),
         user: Joi.object().keys({
            name: Joi.string().min(20),
            icon: Joi.string(),
            email: Joi.string().min(20)
         }),
         country: Joi.string().min(20),
         state: Joi.string().min(20),
         city: Joi.string().min(20),
         comments: Joi.string().min(20),
         avaliation: Joi.string().min(20),
         publishedAt: Joi.date(),
         modifiedAt: Joi.date()
      };
   }

   //Friends
   function validateFriendPayload() {
      return {
         userId: Joi.string().required(),
         user: Joi.object()
            .keys({
               name: Joi.string()
                  .min(20)
                  .required(),
               icon: Joi.string().required(),
               email: Joi.string()
                  .min(20)
                  .required()
            })
            .required(),
         publishedAt: Joi.date().required(),
         modifiedAt: Joi.date().required()
      };
   }
   function validateFriendPatchPayload() {
      return {
         userId: Joi.string(),
         user: Joi.object()
            .keys({
               name: Joi.string().min(20),
               icon: Joi.string(),
               email: Joi.string().min(20)
            })
            .required(),
         publishedAt: Joi.date(),
         modifiedAt: Joi.date()
      };
   }

   try {
      Database.conectar();
      const postObj = new Database(postsModel);
      const userObj = new Database(usersModel);
      const commentObj = new Database(commentsModel);
      const placeObj = new Database(placesModel);
      const friendsObj = new Database(friendsModel);

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
         },
         {
            path: '/login/{id}',
            method: 'GET',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await users.listar({
                     _id: id
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
         //Posts routes
         {
            method: 'GET',
            path: '/posts',
            handler: async (request, h) => {
               try {
                  const { limitar, ignorar } = request.query;
                  const resultado = await postObj.listar(
                     {},
                     {
                        limitar,
                        ignorar
                     }
                  );
                  return resultado;
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
               description: 'Lista publicacoes paginadas',
               notes: 'Pode paginar, com limte e itens a ignorar',
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
            method: 'POST',
            path: '/posts',
            handler: async (request, h) => {
               try {
                  const item = request.payload;
                  const resultado = await postObj.cadastrar(item);
                  return resultado;
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
               description: 'Cadastra publicação com comentario',
               notes: 'Pode cadastrar uma publicacao',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validatePostPayload()
               }
            }
         },
         {
            path: '/posts/{id}',
            method: 'DELETE',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await postObj.remover(id);
                  return result;
               } catch (error) {
                  console.error('DEU RUIM', error);
                  return Boom.internal();
               }
            },
            config: {
               tags: ['api'],
               description: 'Vai remover um post pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
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
            path: '/posts/{id}',
            method: 'PATCH',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const content = request.payload;
                  const result = await postObj.atualizar(id, content);
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
               description: 'Atualiza um post parcialmente',
               notes: 'deve passar um objeto valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validatePostPatchPayload(),
                  params: {
                     id: Joi.string()
                        .min(3)
                        .max(200)
                  }
               }
            }
         },
         {
            path: '/posts/{id}',
            method: 'GET',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await postObj.listar({ _id: id });
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
               description: 'Obtem um post pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
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
            path: '/posts/{postId}/comments/{commentId}',
            method: 'GET',
            handler: async (request, h) => {
               try {
                  const { postId, commentId } = request.params;
                  const result = await postObj.listar({
                     _id: postId,
                     'comments._id': commentId
                  });
                  const resultadoMapeado = result.map(item => {
                     item.comments = item.comments.find(
                        comment => comment._id.toString() === commentId
                     );
                     return item;
                  });
                  return resultadoMapeado;
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
               description: 'Obtem somente o comentário desejado de um post',
               notes: 'A partir de um post, retorna o comentario escolhido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  params: {
                     postId: Joi.string()
                        .max(200)
                        .required(),
                     commentId: Joi.string()
                        .max(200)
                        .required()
                  }
               }
            }
         },
         //User routes
         {
            method: 'GET',
            path: '/users',
            handler: async (request, h) => {
               try {
                  const { limitar, ignorar } = request.query;
                  const resultado = await userObj.listar(
                     {},
                     {
                        limitar,
                        ignorar
                     }
                  );
                  return resultado;
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
               description: 'Lista usuários paginados',
               notes: 'Pode paginar, com limte e itens a ignorar',
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
            method: 'POST',
            path: '/users',
            handler: async (request, h) => {
               try {
                  const item = request.payload;
                  console.log(item, 'item');
                  const resultado = await userObj.cadastrar(item);
                  return resultado;
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
               description: 'Cadastra usuário',
               notes: 'Pode cadastrar um usuário',
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
            path: '/users/{id}',
            method: 'DELETE',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await userObj.remover(id);
                  return result;
               } catch (error) {
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
                  failAction: (request, h, err) => {
                     throw err;
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
            path: '/users/{id}',
            method: 'PATCH',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const content = request.payload;
                  const result = await userObj.atualizar(id, content);
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
               description: 'Atualiza um usuário parcialmente',
               notes: 'deve passar um objeto valido',
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
         },
         {
            path: '/users/{id}',
            method: 'GET',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await userObj.listar({ _id: id });
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
               description: 'Obtem um usuário pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  params: {
                     id: Joi.string()
                        .max(200)
                        .required()
                  }
               }
            }
         },
         //Comment routs
         {
            method: 'GET',
            path: '/comments',
            handler: async (request, h) => {
               try {
                  const { limitar, ignorar } = request.query;
                  const resultado = await commentObj.listar(
                     {},
                     {
                        limitar,
                        ignorar
                     }
                  );
                  return resultado;
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
               description: 'Lista comentários paginados',
               notes: 'Pode paginar, com limte e itens a ignorar',
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
            method: 'POST',
            path: '/comments',
            handler: async (request, h) => {
               try {
                  const item = request.payload;
                  const resultado = await commentObj.cadastrar(item);
                  return resultado;
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
               description: 'Cadastra comentário',
               notes: 'Pode cadastrar um comentário',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validateCommentPayload()
               }
            }
         },
         {
            path: '/comments/{id}',
            method: 'DELETE',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await commentObj.remover(id);
                  return result;
               } catch (error) {
                  console.error('DEU RUIM', error);
                  return Boom.internal();
               }
            },
            config: {
               tags: ['api'],
               description: 'Vai remover comentário pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
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
            path: '/comments/{id}',
            method: 'PATCH',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const content = request.payload;
                  const result = await commentObj.atualizar(id, content);
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
               description: 'Atualiza um comentário parcialmente',
               notes: 'deve passar um objeto valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validateCommentPatchPayload(),
                  params: {
                     id: Joi.string()
                        .min(3)
                        .max(200)
                  }
               }
            }
         },
         {
            path: '/comments/{id}',
            method: 'GET',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await commentObj.listar({ _id: id });
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
               description: 'Obtem um comentário pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  params: {
                     id: Joi.string()
                        .max(200)
                        .required()
                  }
               }
            }
         },
         //Place routes
         {
            method: 'GET',
            path: '/places',
            handler: async (request, h) => {
               try {
                  const { limitar, ignorar } = request.query;
                  const resultado = await placeObj.listar(
                     {},
                     {
                        limitar,
                        ignorar
                     }
                  );
                  return resultado;
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
               description: 'Lista lugar paginados',
               notes: 'Pode paginar, com limte e itens a ignorar',
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
            method: 'POST',
            path: '/places',
            handler: async (request, h) => {
               try {
                  const item = request.payload;
                  const resultado = await placeObj.cadastrar(item);
                  return resultado;
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
               description: 'Cadastra lugar',
               notes: 'Pode cadastrar um lugar',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validatePlacePayload()
               }
            }
         },
         {
            path: '/places/{id}',
            method: 'DELETE',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await placeObj.remover(id);
                  return result;
               } catch (error) {
                  console.error('DEU RUIM', error);
                  return Boom.internal();
               }
            },
            config: {
               tags: ['api'],
               description: 'Vai remover lugar pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
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
            path: '/places/{id}',
            method: 'PATCH',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const content = request.payload;
                  const result = await placeObj.atualizar(id, content);
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
               description: 'Atualiza um lugar parcialmente',
               notes: 'deve passar um objeto valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validatePlacePatchPayload(),
                  params: {
                     id: Joi.string()
                        .min(3)
                        .max(200)
                  }
               }
            }
         },
         {
            path: '/places/{id}',
            method: 'GET',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await placeObj.listar({ _id: id });
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
               description: 'Obtem um lugar pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  params: {
                     id: Joi.string()
                        .max(200)
                        .required()
                  }
               }
            }
         },
         //Friends routes
         {
            method: 'GET',
            path: '/friends',
            handler: async (request, h) => {
               try {
                  const { limitar, ignorar } = request.query;
                  const resultado = await friendsObj.listar(
                     {},
                     {
                        limitar,
                        ignorar
                     }
                  );
                  return resultado;
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
               description: 'Lista amigos paginados',
               notes: 'Pode paginar, com limte e itens a ignorar',
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
            method: 'POST',
            path: '/friends',
            handler: async (request, h) => {
               try {
                  const item = request.payload;
                  const resultado = await friendsObj.cadastrar(item);
                  return resultado;
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
               description: 'Cadastra amigo',
               notes: 'Pode cadastrar um amigo',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validateFriendPayload()
               }
            }
         },
         {
            path: '/friends/{id}',
            method: 'DELETE',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const result = await friendsObj.remover(id);
                  return result;
               } catch (error) {
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
                  failAction: (request, h, err) => {
                     throw err;
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
            path: '/friends/{id}',
            method: 'PATCH',
            handler: async (request, h) => {
               try {
                  const { id } = request.params;
                  const content = request.payload;
                  const result = await friendsObj.atualizar(id, content);
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
               description: 'Atualiza um amigo parcialmente',
               notes: 'deve passar um objeto valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  payload: validateFriendPatchPayload(),
                  params: {
                     id: Joi.string()
                        .min(3)
                        .max(200)
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
                  const result = await friendsObj.listar({ _id: id });
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
               description: 'Obtem um amigo pelo id',
               notes: 'O id deve ser valido',
               validate: {
                  headers: validateHeaders(),
                  failAction: (request, h, err) => {
                     throw err;
                  },
                  params: {
                     id: Joi.string()
                        .max(200)
                        .required()
                  }
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
}
main();
