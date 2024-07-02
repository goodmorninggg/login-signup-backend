const mongoose  = require('mongoose');

const connectDB  = async()=>{
    try{
    //mongodb connection string

    console.log(process.env.MONGODB_URL)
    const con  = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify : false,
        // useCreateIndex : true,
    })
    console.log(`MongoDB connected : ${con.connection.host}`)
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB