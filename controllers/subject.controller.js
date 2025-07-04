const {prisma}=require("../prisma/client");
const createSubject=async(req,res)=>{
    const {user_id,subject_name}=req.body;
    if(!user_id||!subject_name){
        return res.status(400).json({
            error:"bad request",
            message:"user id and subject name  are required"
        });
    }
    try{
        const subjectData=await prisma.subject.create({
            data:{
                user_id:user_id,
                subject_name:subject_name
            }
        });
res.status(201).json({
    message:"subject created",
    data:subjectData
});
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const getAllSubjects=async(req,res)=>{
    const user_id=req.query.user_id;
    if(!user_id){
        return res.status(400).json({
            error:"bad request",
            message:"user id is required"
        });  
    }
    try{
        const allSubjects = await prisma.subject.findMany({
            where: { user_id: user_id },
            select: {
              subject_name: true,
              id: true, 
            }
          });
       res.status(200).json({
        subjects:allSubjects
       }) ;
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const deleteSubject=async(req,res)=>{
    const id=req.query.id;
        if(!id){
            return res.status(400).json({
                error:"bad request",
                message:"subject id is required"
            });   
    }
    try{
        await prisma.subject.delete({
            where: {
              id:id,
            },
          })
          res.status(200).json({
            message:"subject deleted"
          });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        }); 
    }
}
const updateSubject=async(req,res)=>{
    const {id,subject_name}=req.body;
    if(!id||!subject_name){
        return res.status(400).json({
                error:"bad request",
                message:"id and name are required"
            });}
    try{
await prisma.subject.update({
    where:{id:id},
    data:{
        subject_name:subject_name,
    }
})
res.status(200).json({
    message:"subject name updated",
});
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        }); 
    }
    
}
module.exports={createSubject,getAllSubjects,deleteSubject,updateSubject}