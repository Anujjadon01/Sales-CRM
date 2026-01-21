import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // 🔥 duplicate email block
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["New Leads", "Interested", "Follow-up", "Not Reachable", "Close"],
      default: "New Leads",
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastAssigned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

const Leads = mongoose.model("Lead", leadSchema);
export default Leads;
