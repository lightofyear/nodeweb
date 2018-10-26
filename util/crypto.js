const crypto = require("crypto");
module.exports = (str,username)=>{
    let
        key = username ,
        method = crypto.createHmac("sha256",key);
        method.update(str);

    return method.digest("hex");
};