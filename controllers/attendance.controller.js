const {prisma}=require("../prisma/client");
const addRow=async(req,res)=>{
    const {subject_id,status,date,day}=req.body;
    if(!subject_id||!status||!date||!day){
        return res.status(400).json({
            error:"bad request",
            message:"all fields are required"
        });
    }
    try{
        await prisma.$executeRaw`
        SELECT add_total_classes(${subject_id})`;
      if(status==="present"){
        await prisma.$executeRaw`
        SELECT add_attended_classes(${subject_id})`;
      }
const rowData=await prisma.attendance.create({
    data:{
       subject_id:subject_id,
       status:status,
       date:date,
       day:day
    }
})
res.status(200).json({
    message:"row added",
    data:rowData
});
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const deleteRow=async(req,res)=>{
    const {id,subject_id,status}=req.body;
if(!id||!status||!subject_id){
    return res.status(400).json({
        error:"bad request",
        message:"all fields are required"
    });
}
try{
    await prisma.$executeRaw`
    SELECT decrease_total_classes(${subject_id})`;   
if(status==="present"){
    await prisma.$executeRaw`
    SELECT decrease_attended_classes(${subject_id})`; 
    console.log("yo");
}
await prisma.attendance.delete({
    where:{
        id:id,
    }
})
res.status(200).json({
    message:"row deleted"
});
}catch(err){
    res.status(500).json({
        error:"server error",
        message:err.message
    });
}
}
const subjectAttendance=async(req,res)=>{
    const {id:subject_id}=req.params;
    if(!subject_id){
        return res.status(400).json({
            error:"bad request",
            message:"subject id is required"
        });  
    }
    try{
const result=await prisma.subject.findUnique({
    where:{id:subject_id},
    select:{
attended_classes:true,
total_classes:true,
    },
})
let percentage=0;
if(!result){
    return res.status(404).json({
        error: "not found",
        message: "Subject not found"
      });
}
if(result.total_classes!=0){
    percentage=(result.attended_classes/result.total_classes)*100;
}
const rows=await prisma.attendance.findMany({
    where:{subject_id:subject_id},
})
res.status(200).json({
    attended_classes:result.attended_classes,
    total_classes:result.total_classes,
    percent:percentage,
    allRows:rows
});
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });  
    }
}

const updateRow=async(req,res)=>{
const {id,subject_id,new_status,new_date,new_day}=req.body;
if(!id||!subject_id||!new_status||!new_date||!new_day){
        return res.status(400).json({
            error:"bad request",
            message:"all fields are required"
        });
    }
    try{
       const result=await prisma.attendance.findUnique({
        where:{
            id:id,
        },
        select:{
status:true,
        },
       })
   
       if(!result){
        return res.status(404).json({
            error: "not found",
            message: "row not found"
          });
       }

if (result.status !== new_status) {
      if(new_status==="present"){
        await prisma.$executeRaw`
        SELECT increase_attended_classes(${subject_id});
        `;
      }
      else if(new_status==="absent"){
        await prisma.$executeRaw`
        SELECT decrease_attended_classes(${subject_id});
        `;
      }
    }
 await prisma.attendance.update({
where:{
    id:id,
},
data:{
status:new_status,
date:new_date,
day:new_day,
}
 }) 
res.status(200).json({
    message:"row updated",
});
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
module.exports={addRow,deleteRow,subjectAttendance,updateRow}