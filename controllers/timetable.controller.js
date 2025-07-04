const {prisma}=require("../prisma/client");
const saveTimetable=async(req,res)=>{
   const {user_id,timetable}=req.body;
   if(!user_id|| timetable==null||timetable.length===0){
    return res.status(400).json({
        error:"bad request",
        message:"request body is empty"
    });
   }
   try{
const old_data=await prisma.timetable.findMany({
    where:{user_id:user_id},
    select:{
        day:true,
    }
})
if(old_data.length>0){
await prisma.timetable.deleteMany({
    where:{user_id:user_id},
})
}
const groupByDay={};
for(const data of timetable){

    if(!groupByDay[data.day]) groupByDay[data.day]=[];
    groupByDay[data.day].push(data);
}
for(const day in groupByDay){
    const slots=groupByDay[day];
    slots.sort((a,b)=>a.start_time.localeCompare(b.start_time));
    for(let i=1;i<slots.length;i++){
        const prev=slots[i-1];
        const curr=slots[i];
if(prev.end_time>curr.start_time){
    return res.status(400).json({
        error:"overlapping intervals",
        message:`Overlapping intervals on ${day}: ${prev.start_time}-${prev.end_time} and ${curr.start_time}-${curr.end_time}`
    });
}
    }
}
await prisma.$transaction(
      timetable.map(entry =>
        prisma.timetable.create({
          data: {
            user_id,
            day: entry.day,
            start_time: entry.start_time,
            end_time: entry.end_time,
            subject_id: entry.subject_id
          }
        })
      )
    );
return res.status(201).json({
    message:"timetable stored"
});
}
catch(err){
res.status(500).json({
        error:"server error",
        message:err.message
    });
   }
}
const getTimetable=async(req,res)=>{
    const user_id=req.query.user_id;
    if(!user_id){
        return res.status(400).json({
            error:"bad request",
            message:"user id is required"
        });
    }
    try{
        const table=await prisma.timetable.findMany({
            where:{user_id:user_id},
            select:{
day:true,
subject_id:true,
start_time:true,
end_time:true,
            },
        })
        if(table.length==0){
            return res.status(404).json({
                error:"not found",
                message:"timetable of user not found"
            });
        }
        res.status(200).json({
            timetable:table
        });
    }catch(err){
res.status(500).json({
        error:"server error",
        message:err.message
    });
    }
}
const deleteTimetable=async(req,res)=>{
    const user_id=req.query.user_id;
    if(!user_id){
        return res.status(400).json({
            error:"bad request",
            message:"user id is required"
        });
    }
    try{
        await prisma.timetable.deleteMany({
            where:{user_id:user_id},
        })
        return res.status(200).json({
            message:"time table deleted",
        })
    }catch(err){
        res.status(500).json({
        error:"server error",
        message:err.message
    });
    }
}
module.exports={saveTimetable,getTimetable,deleteTimetable};