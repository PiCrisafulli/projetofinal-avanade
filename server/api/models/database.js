const Mongoose = require('mongoose')

const userSchema = new Mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    email: { type: String, required: true },
    dateBirth: { type: Date, required: true },
    sex: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    typeLogin: { type: String, required: true },
    password: { type: String, required: true },
    biography: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    modifiedAt: { type: Date, required: true }
});
const friendsSchema = new Mongoose.Schema({
    userId: Mongoose.Types.ObjectId,
    user: userSchema,
    confirmed: { type: Boolean, required: true },
    publishedAt: { type: Date, required: true }
});
const placesSchema = new Mongoose.Schema({
    userId: Mongoose.Types.ObjectId,
    user: userSchema,
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    comments: { type: String, required: true },
    avaliation: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    modifiedAt: { type: Date, required: true }
});
const commentsSchema = new Mongoose.Schema({
    postId: Mongoose.Types.ObjectId,
    text: { type: String, required: true },
    user: userSchema,
    publishedAt: { type: Date, required: true },
    modifiedAt: { type: Date, required: true }
});
const imagesSchema = new Mongoose.Schema({
    postId: Mongoose.Types.ObjectId,
    src: { type: String, required: true },
    publishedAt: { type: Date, required: true }
});
const videosSchema = new Mongoose.Schema({
    postId: Mongoose.Types.ObjectId,
    src: { type: String, required: true },
    publishedAt: { type: Date, required: true }
});
const postSchema = new Mongoose.Schema({
    description: { type: String, required: true },
    link: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    user: userSchema,
    images: [imagesSchema],
    videos: [videosSchema],
    comments: [commentsSchema],
    likes: { type: Number, required: true }
});

class DatabaseMongoDB {
    constructor(connection) {
        //recebemos o modelo de dados para usar os comandos do mongoose
        this.connection = connection
    }
    static conectar() {
        Mongoose
            .connect('mongodb://localhost:27017/socialnetwork', { useNewUrlParser: true })

        const connection = Mongoose.connection
        connection.once('open', () => console.log('bd running'))

        const userModel = Mongoose.model('users', userSchema)
        const friendModel = Mongoose.model('friends', friendsSchema)
        const placeModel = Mongoose.model('places', placesSchema)
        const commentModel = Mongoose.model('comments', commentsSchema)
        const imageModel = Mongoose.model('images', imagesSchema)
        const videoModel = Mongoose.model('videos', videosSchema)
        const postModel = Mongoose.model('posts', postSchema)

        return {
            userModel,
            friendModel,
            placeModel,
            commentModel,
            imageModel,
            videoModel,
            postModel
        };
    }

    async cadastrar(item) {
        return await this.connection.create(item)
    }

    atualizar(id, item) {
        return this.connection.updateOne({ _id: id }, { $set: item })
    }

    listar(query = {}, pagination = { ignorar: 0, limitar: 10 }) {
        return this.connection
            .find(query)
            .skip(pagination.ignorar)
            .limit(pagination.limitar)
    }

    remover(id) {
        return this.connection.deleteOne({ _id: id })
    }
}

//tornamos nossa classe publica, neste momento outros arquivos poderão acessar
module.exports = DatabaseMongoDB;