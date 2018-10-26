
const {Schema} = require('./connect');
const ObjectId = Schema.Types.ObjectId;

const  commentSchema = new Schema({
   uid : {
       type: ObjectId, //定义关联字段  Schema 的第一个参数
       ref: 'users'  //关联 的表
   },
    aid:{
        type: ObjectId, //定义关联字段  Schema 的第一个参数
        ref: 'articles'  //关联 的表
    },
    content : String,

},{
    versionKey:false,
    timestamps:{
        createdAt: "created"
    }
});

module.exports = commentSchema;