
const {Schema} = require('./connect');
const  userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    role:{
      type:String,
      default: 1,
    },
    hpic : {
        type : String,
        default : '/imgs/default/default.jpg'
    },
    articlenum: {
        type: Number,
        default : 0
    },
},{
    versionKey:false,
    timestamps:{
    createdAt: "created"
    }
});

module.exports = userSchema;