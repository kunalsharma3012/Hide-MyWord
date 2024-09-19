import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbconnect();
   
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated',
            },
            { status: 402 }
        );
    }

    const userid = user._id;
    const { acceptMessages } = await request.json();
   console.log(acceptMessages);
   
    

    try {
        const updateduser = await UserModel.findByIdAndUpdate(
            userid,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        
        
     if(!updateduser){
        return Response.json(
            {
                success: false,
                message: 'Failed to find user to change acceptance status',
            },
            { status: 400 }
        );
     }

     return Response.json(
        {
            success: true,
            message: 'Message acceptance status changed successfully',
        },
        { status: 200 }
    );


    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Failed to toggle accepting messages or not',
            },
            { status: 500 }
        );
    }



};
  


export async function GET(request:Request) {
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated',
            },
            { status: 402 }
        );
    }

        try {
            const foundUser = await UserModel.findById(user._id);

            if (!foundUser) {
                // User not found
                return Response.json(
                  { success: false, message: 'User not found' },
                  { status: 404 }
                );
              }
          
              // Return the user's message acceptance status
              return Response.json(
                {
                  success: true,
                  isAcceptingMessages: foundUser.isAcceptingMessage,
                },
                { status: 200 }
              );
        } catch (error) {
            console.error('Error retrieving message acceptance status:', error);
            return Response.json(
              { success: false, message: 'Error retrieving message acceptance status' },
              { status: 500 }
            );
            
        }
}

