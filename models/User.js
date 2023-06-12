import exp from "constants";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
      },
    avatarUrl: String,
},
{
    timestamps: true,
});

UserSchema.methods.isStudent = function () {
    return this.role == "student";
  };

  UserSchema.methods.isIsntructor  = function () {
    return this.role == "instructor ";
  };
  
export default mongoose.model('User', UserSchema);