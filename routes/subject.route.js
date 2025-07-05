const express=require("express");
const router=express.Router();
const {getAllSubjects,updateSubject,createSubject,deleteSubject}=require("../controllers/subject.controller")
router.route("/")
.put(updateSubject)
.post(createSubject)
router.route("/:id").get(getAllSubjects)
.delete(deleteSubject);
module.exports=router;