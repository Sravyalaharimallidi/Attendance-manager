const express=require("express");
const router=express.Router();
const {saveTimetable,getTimetable,deleteTimetable}=require("../controllers/timetable.controller")
router.route("/").post(saveTimetable);
router.route("/:id").get(getTimetable)
.delete(deleteTimetable);
module.exports=router;