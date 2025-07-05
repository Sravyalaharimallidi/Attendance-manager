const express=require("express");
const router=express.Router();
const {addRow,deleteRow,subjectAttendance,updateRow}=require("../controllers/attendance.controller");
router.route("/").post(addRow)
.delete(deleteRow)
.put(updateRow)
router.route("/:id").get(subjectAttendance)
module.exports=router;