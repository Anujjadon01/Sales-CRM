import Leads from "../models/Lead.js";
import UserModel from "../models/UserModel.js"


let globalIndex = 0;
const AutoAssign = async (leadDoc) => {
  const users = await UserModel.find({ role: "user" });
  if (!users.length) return;

  for (const lead of leadDoc) {
    await Leads.findByIdAndUpdate(lead._id, {
      assignTo: users[globalIndex]._id,
    });

    globalIndex = (globalIndex + 1) % users.length;
  }
};

export default AutoAssign;