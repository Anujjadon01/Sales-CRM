import express from "express"
import {DeleteLead, editStage, GetLead, GetLeadDashboard, GetUser, Lead, leadFilter, uploadLeads} from "../controllers/Task.js"
import {uploadLeadsFile } from "../utils/multer.js"
import { IsAuth } from "../middleware/IsAuth.js"
const taskRouter=express.Router()

taskRouter.post("/contact-lead",Lead)
taskRouter.get("/fetch-lead",IsAuth,GetLead)
taskRouter.patch("/update-stage",editStage)
taskRouter.post("/filter-leads",leadFilter)
taskRouter.get("/get-users",GetUser)
taskRouter.get("/get-leads-status",GetLeadDashboard)
taskRouter.delete("/delete-task",DeleteLead)
taskRouter.post(
  "/upload-leads",
  uploadLeadsFile.single("leadsFile"),
  uploadLeads
);

export default taskRouter