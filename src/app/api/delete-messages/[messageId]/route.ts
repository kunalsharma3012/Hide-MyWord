import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import { User } from "next-auth";



export async function DELETE(request: Request,
 { params }: { params: { messageId: string } }) {
    const messageid = params.messageId;
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated',
            },
            { status: 403 }
        );
    }
    console.log(`deleting message ${messageid}`);


    try {
        const updateUser = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: messageid } } }

        )
        if (updateUser.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: 'Deleting message error',
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: 'message deleted successfully',
            },
            { status: 200 }
        )


    } catch (error) {
        console.log(error);

        return Response.json(
            {
                success: false,
                message: 'Issue in deleting the message',
            },
            { status: 500 }
        )

    }


}