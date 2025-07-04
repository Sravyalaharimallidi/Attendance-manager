const crypto=require('crypto');
require('dotenv').config();
const key=Buffer.from(process.env.ENCRYPTION_KEY,'utf8');
if (key.length !== 32) throw new Error("Key must be 32 bytes");
const encryptMail=(email)=>{
const iv=crypto.randomBytes(12);
const cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
const encrypted=Buffer.concat([cipher.update(email,'utf8'),cipher.final()]);
const tag=cipher.getAuthTag();
return{
    ciphertext:encrypted.toString('base64'),
    iv:iv.toString('base64'),
    tag:tag.toString('base64'),
};
}
const decryptMail=(ciphertext,iv,tag)=>{
    const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(iv,'base64'));
    decipher.setAuthTag(Buffer.from(tag,'base64'));
    const decrypted=Buffer.concat([decipher.update(Buffer.from(ciphertext,'base64')),decipher.final(),]);
    return decrypted.toString('utf8');
}
module.exports={encryptMail,decryptMail};