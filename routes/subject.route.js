const express=require("express");
const router=express.Router();
const {getAllSubjects,updateSubject,createSubject,deleteSubject}=require("../controllers/subject.controller")
router.route("/").get(getAllSubjects)
.put(updateSubject)
.post(createSubject)
.delete(deleteSubject);
module.exports=router;