const express=require("express");
const router=express.Router();
const {createUser,updateUser,signInUser,signOutUser}=require("../controllers/user.controller");
router.route("/").post(createUser)
.put(updateUser);
router.route("/signin").post(signInUser);
router.route("/signout").get(signOutUser);
module.exports=router;