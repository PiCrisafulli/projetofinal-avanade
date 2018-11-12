const Mongoose = require('mongoose');

class Database {
   constructor(connection) {
      //recebemos o modelo de dados para usar os comandos do mongoose
      this.connection = connection;
   }
   static conectar() {
      Mongoose.connect(
         'mongodb://localhost:27017/socialnetwork',
         { useNewUrlParser: true }
      );

      const connection = Mongoose.connection;
      connection.once('open', () => console.log('bd running'));
   }

   async cadastrar(item) {
      return await this.connection.create(item);
   }

   atualizar(id, item) {
      return this.connection.updateOne({ _id: id }, { $set: item });
   }
   listar(query = {}, pagination = { ignorar: 0, limitar: 10 }) {
      return this.connection
         .find(query)
         .skip(pagination.ignorar)
         .limit(pagination.limitar);
   }

   remover(id) {
      return this.connection.deleteOne({ _id: id });
   }
}

//tornamos nossa classe publica, neste momento outros arquivos poderão acessar
module.exports = Database;
