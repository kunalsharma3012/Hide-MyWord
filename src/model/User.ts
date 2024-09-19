import mongoose , { Schema , Document } from "mongoose";


export interface Message extends Document{
    content: string;
    createdAt: Date
}


const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
});

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    message: Message[]
}

const UserSchema : Schema<User> = new Schema({
   username:{
    type:String,
    required:[true,"Username is required"],
    unique:true,
    trim:true
   },
   email:{
    type:String,
    required:[true,"email is required"],
    unique:true,
    match:[/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,"please use valid email address"]
   },
   password:{
    type:String,
    required:[true,"password is required"],
   },
   verifyCode:{
    type:String,
    required:[true,"Verify Code is required"],
   },
   verifyCodeExpiry:{
    type:Date,
    required:[true,"Verify Code Expiry is required"],
   },
   isVerified:{
    type:Boolean,
    required:true,
    default:false,
   },
   isAcceptingMessage:{
    type:Boolean,
    default:true,
   },
   message:[MessageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<User>)  ||
  mongoose.model<User>("User", UserSchema)

  export default UserModel;