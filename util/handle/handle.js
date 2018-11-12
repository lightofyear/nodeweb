
const handele = (hdObj)=>{

    let ctx = hdObj.ctx,
        db = hdObj.db ,
        method = hdObj.method || 'select',
        condition = hdObj.condition || {},
        unless  = hdObj.unless || {};

   let methods = {
       select:async()=>{
          new Promise(async (res,rej)=>{
              db.find(condition,unless,async(err,data)=>{
                  let backVal = {};
                  backVal.status = 0;
                  backVal.msg = 'fail';
                  backVal.data = [];
                  if(err){
                      rej(err) ;
                  }
                   if(data.length){
                       backVal.status = 1;
                       backVal. msg = 'ok';
                       backVal. data = data;
                   }
                   res(backVal);
              });
          }).then(async data=>{
              ctx.body = data;
          }).
          catch(err =>{
              console.log(err);
          });
       },
       insert:async()=>{
           callback(ctx);
       },
       update:async()=>{
           console.log('update');
       },
       delete:async()=>{
           console.log('delete');
           callback(ctx);
       }
   };

    methods[method]();
};

module.exports = handele;