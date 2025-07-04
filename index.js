const express=require("express");
const cors=require("cors");
const {prisma}=require("./prisma/client");
require("./utils/mails");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/user",require("./routes/user.routes"));
app.use("/subject",require("./routes/subject.route"));
app.use("/attendance",require("./routes/attendance.route"));
app.use("/timetable",require("./routes/timetable.route"));
app.listen(5000,(req,res)=>{
    console.log("running at 5000");
})
//disconnecting prisma
process.on('SIGINT', async () => {
    console.log('Shutting down...')
    await prisma.$disconnect()
    process.exit(0)
  })
  
process.on('SIGTERM', async () => {
    console.log('Shutting down...')
    await prisma.$disconnect()
    process.exit(0)
  })