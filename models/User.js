import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, require: false },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// pre: func sẽ chạy trước khi user được 'save'
UserSchema.pre("save", async function (next) {
  // this là các giá trị khi "creating a new user" trong userController
  if (this.isModified("password")) {
    // mã hóa lại dữ liệu
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

UserSchema.methods.generateJWT = async function () {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // expires in 30 days
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);

export default User;
