const express=require("express");
const router=express.Router();
const {addRow,deleteRow,subjectAttendance,updateRow}=require("../controllers/attendance.controller");
router.route("/").post(addRow)
.get(subjectAttendance)
.delete(deleteRow)
.put(updateRow)
module.exports=router;