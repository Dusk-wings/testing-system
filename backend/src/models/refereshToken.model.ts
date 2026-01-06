import mongoose from "mongoose";

const refereshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user_id: { type: String, required: true },
    expires_at: { type: Number, required: true },
})

const RefereshTokenModel = mongoose.model("RefereshToken", refereshTokenSchema)

export default RefereshTokenModel