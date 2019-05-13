const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const pictureSchema = new Schema({
  name: String,
  path: String,
  originalName: String,
  description:{ type : String , maxlength: 200},
  category:String,
  owner:  { type : Schema.Types.ObjectId, ref: 'user' } 
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;