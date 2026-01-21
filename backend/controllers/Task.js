import UserModel from "../models/UserModel.js";
import Leads from "../models/Lead.js";
import AutoAssign from "../utils/AutoassignLeads.js"

export const Lead = async (req, res) => {
  try {
    const { fullname, email, phone} = req.body;

    const lead = await Leads.create({
      fullname,
      email,
      phone,
      status:"New Leads"
    });

    await AutoAssign([lead])
    return res.status(201).json({ message: "your task addded" });
  } catch (error) {
    console.log(error);
  }
};

export const GetLead = async (req, res) => {
  try {
    let data = await Leads.find({assignTo:req.user._id});
    if (req.user.role=="admin") {
     data = await Leads.find();
    }
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
  }
};

export const GetLeadDashboard = async (req, res) => {
  try {
    const Data = {
      newLead: await Leads.countDocuments({ status: "New Leads" }),
      interested: await Leads.countDocuments({ status: "Interested" }),
      followUp: await Leads.countDocuments({ status: "Follow-up" }),
      notReachable: await Leads.countDocuments({ status: "Not Reachable" }),
      close: await Leads.countDocuments({ status: "Close" }),
    };

    return res.status(200).json(Data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};



export const editStage = async (req, res) => {
  try {

    const { id, status } = req.body;

    if (!id || !status) {
      console.error("❌ Missing id or stage", { id, status });
      return res
        .status(400)
        .json({ message: "Missing required fields: id or stage" });
    }

    const updateData = { status };

    

    if (status === "Close") {
      updateData.closedAt = new Date();
    
    } 

const lead=await Leads.findById(id)
   if (lead.status === "Close") {
      return res.status(403).json({
        message: "Closed opportunities cannot be moved to another stage",
      });
    }


    const updatedLead = await Leads.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Opportunity not found" });
    }


    return res.status(200).json({
      message: "Stage updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};












export const leadFilter=async(req,res)=>{
  try {
    const {status,activity,company,Assign}=req.body
    let query={}
    if (status.length>0) {
      query.status={$in:status}
    }
    if (activity) {
      const now=new Date()
      const past=new Date()

      if (activity=="today") {
        past.setHours(0,0,0,0)
      }
      if (activity=="yesterday") {
        past.setDate(now.getDate()-1)
         pastDate.setHours(0, 0, 0, 0);
  
      }
      if (activity=="7d") {
        past.setDate(now.getDate()-7)
      }
      if (activity=="30d") {
        past.setDate(now.getDate()-30)
      }
      
      query.createdAt={$gte:past}

    }
    if (company) {
      query.company_name={$regex:company,$options:"i"}
    }
    if (Assign) {
      query.Assign=Assign
    }

    const data=await Leads.find(query)

    return res.status(200).json(data)

  } catch (error) {
    console.log(error);
    
  }
}







export const GetUser = async (req, res) => {
  try {
    const data = await UserModel.find({role:"user"});
    
    return res.status(201).json(data.length);
  } catch (error) {
    console.log(error);
  }
};





import XLSX from "xlsx";
import https from "https";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/* ================= HELPER: Cloudinary URL → Buffer ================= */
const getBufferFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
};

export const uploadLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = await getBufferFromUrl(req.file.path);
    const mimeType = req.file.mimetype;

    let leads = [];
    const insertData=[]
    console.log("MIME:", mimeType);
console.log("LEADS:", leads);

    /* ================= EXCEL ================= */
    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel"
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      leads = rows.map((row) => ({
        fullname: row.fullname,
        email: row.email,
         phone: row.phone ? String(row.phone) : "",
      }));
    }

    /* ================= PDF ================= */
    if (mimeType === "application/pdf") {
      const pdfData = await pdfParse(buffer);

      // 🔥 Strong split (real PDFs ke liye)
      const blocks = pdfData.text.split(/Name:/i);

      blocks.forEach((block) => {
        const name = block.match(/^\s*(.*)/);
        const email = block.match(/Email:\s*(.*)/i);
        const phone = block.match(/Phone:\s*(.*)/i);

        if (name && email) {
          leads.push({
            fullname: name[1].trim(),
            email: email[1].trim(),
            phone: phone ? phone[1].trim() : "",
          });
        }
      });
    }

    /* ================= DB SAVE ================= */
    let inserted = 0;
    let skipped = 0;

    for (const lead of leads) {
      if (!lead.fullname || !lead.email) {
        skipped++;
        continue;
      }
console.log("LEAD:", lead);
      const exists = await Leads.findOne({ email: lead.email });
         console.log("EXISTS:", exists);  
      if (exists) {
        skipped++;
        continue;
      }

      const saved=await Leads.create({
        fullname: lead.fullname,
        email: lead.email,
        phone: lead.phone,
        status: "New Leads", // 🔥 DEFAULT STATUS
      });
     insertData.push(saved)
      inserted++;
    }
if (insertData.length) {
 await AutoAssign(insertData)
}
    return res.json({
      message: "Leads uploaded successfully",
      inserted,
      skipped,
      total: leads.length,
    });
  } catch (error) {
   console.error("UPLOAD ERROR FULL:", error);
  console.error(error.stack);
  return res.status(500).json({
    message: "Upload failed",
    error: error.message,
  });
  }
};









export const DeleteLead=async(req,res)=>{
  try {
    const {id}=req.body
    if (!id) {
      return res.status(400).json({message:"Lead Id is required"})
    }
    const deleteLead=await Leads.findByIdAndDelete(id)
          return res.status(200).json({message:"Lead deleted"})

  } catch (error) {
    console.log(error);
    
  }
}