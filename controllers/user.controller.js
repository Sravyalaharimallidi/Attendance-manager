const {supabase}=require("../db/db");
const {prisma}=require("../prisma/client");
const {encryptMail}=require("../utils/cryptoUtils");
const createUser=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name||!email||!password){
        return res.status(400).json({
            error:"bad request",
            message:"all fields are required"
        });
    }
    try{
         const {data:signUpData,error:signUpError}=await supabase.auth.signUp({
            email:email,
            password:password
         });
         if(signUpError) throw signUpError;
         const {ciphertext,iv,tag}=encryptMail(email);
         await prisma.user.create({
            data:{
                id:signUpData?.user?.id,
                name:name,
                email_ciphertext:ciphertext,
                email_iv:iv,
                email_tag:tag,
            }
         });
res.status(201).json({
message:"user created"
});
         }catch(err){
    res.status(500).json({
        error:"server error",
        message:err.message
    });
}
}
const updateUser=async(req,res)=>{
    const {id,name}=req.body;
    if (!id || !name) {
        return res.status(400).json({
          error: "bad request",
          message: "id and name are required"
        });
      }    
    try{
await prisma.user.update({
    where:{id:id},
    data:{
        name:name
    }
})
res.status(200).json({
    message:"user name updated"
});
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const signInUser=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({
            error:"bad request",
            message:"both email and password required"
        });
    }
    try{
        const{data:userData,error:userError}=await supabase.auth.signInWithPassword({
            email:email,
            password:password
        });
        if(userError) throw userError;
        res.status(200).json({
            message:"login successful",
            data:userData.user
        });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });}
}
const signOutUser=async(req,res)=>{
    try{
    const { error } = await supabase.auth.signOut()
    if(error) throw error;
    return res.status(200).json({ message: "Signed out successfully" });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
module.exports={createUser,updateUser,signInUser,signOutUser};
