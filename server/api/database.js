const Mongoose = require('mongoose')

class Database {
    constructor(connection) {
        //recebemos o modelo de dados para usar os comandos do mongoose
        this.connection = connection
    }
    static conectar() {
        Mongoose
            .connect('mongodb://localhost:27017/socialnetwork', { useNewUrlParser: true })

        const connection = Mongoose.connection
        connection.once('open', () => console.log('bd running'))
    }
}

//tornamos nossa classe publica, neste momento outros arquivos poderão acessar
module.exports = Database;