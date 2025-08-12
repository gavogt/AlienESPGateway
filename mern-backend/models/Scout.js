import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema({
    type: { type: String, required: true },
    unit: { type: String, default: "" },
    lastValue: { type: Number, default: null },
    lastSeenAt: { type: Date, default: null },
}, { _id: false });

const ScoutSchema = new mongoose.Schema({
    scoutId: { type: String, required: true, unique: true },
    name: { type: String, default: ""},
    status: { type: String, default: "offline" },
    firmware: { type: String, default: "" },
    modules: { type: [ModuleSchema], default: [] },
    lastSeenAt: { type: Date, default: null },
    notes: { type: String, default: ""}
}, { timestamps: true });

export default mongoose.model("Scout", ScoutSchema);