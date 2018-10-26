
const {Schema} = require('./connect');
const ObjectId = Schema.Types.ObjectId;

const  userSchema = new Schema({
    title: {
        type:String,
        default: 'title'
    },
    commentnum: Number,
    content: String,
    uid: {
        type: ObjectId, //定义关联字段  Schema 的第一个参数
        ref: 'users'  //关联 的表
    },
    tips : {
        type : String,
        default: '情感'
    },  // 分类
},{
    versionKey:false,
    timestamps:{
        createdAt: "created"
    }
});

module.exports = userSchema;