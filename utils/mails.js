const nodemailer=require("nodemailer");
const {prisma}=require("../prisma/client");
const {decryptMail}=require("./cryptoUtils");
const cron=require("node-cron");
require('dotenv').config();
const transporter=nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth:{
user:process.env.MAIL,
pass:process.env.MAIL_PASSWORD
    }
});
const sendMail=(to,sub,msg)=>{
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });
}
cron.schedule('0 20 * * *',async()=>{
    try{
   const users=await prisma.user.findMany({
select:{
    id:true,
    name:true,
    email_ciphertext:true,
    email_iv:true,
    email_tag:true,
},
   })
   for(const user of users){
    const days=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const today=new Date();
    const day=days[today.getDay()];
    const subjects=await prisma.timetable.findMany({
        where:{
            user_id:user.id,
            day:day,
        },
        include:{
            subject:true,
        },
    })
    const email=decryptMail(user.email_ciphertext,user.email_iv,user.email_tag);
const subnames=subjects.map(entry=>entry.subject.subject_name);
const message=`hello 
<b>${user.name}</b>,
<br>Please mark the attendance for the following subjects
<ul>
 ${subnames.map(name => `<li><b>${name.toUpperCase()}</b></li>`).join('')}
</ul>
<br>Thank you`;
const subject='attendance';
sendMail(email,subject,message);
   }
console.log("message sent to all users");}catch(err){
    console.error("error in sending mails",err);
   }
});