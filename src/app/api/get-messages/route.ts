import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbconnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated',
            },
            { status: 402 }
        );
    }

    const userid = new mongoose.Types.ObjectId(_user._id)
  
    

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userid } },
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$message' }
                }
            },
            { $project: { _id: 1, messages: 1 } } // Include only the necessary fields
        ]).exec();
       
        

        if (!user) {
            return Response.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
          }
      
          return Response.json(
            { messages: user[0].messages },
            {
              status: 200,
            }
          );
        
    } catch (error) {
        console.error("Unexpected server error" , error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error',
            },
            { status: 500 }
        ); 
    }


}