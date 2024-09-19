import UserModel from '@/model/User';
import dbconnect from '@/lib/dbconnect';

export async function POST(request: Request) {
    await dbconnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
       
        const user = await UserModel.findOne({ username: decodedUsername })
        console.log(user);
        

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 400,
            })
        }

        const correctCode = user.verifyCode === code;
        const expiryCodeTime = new Date(user.verifyCodeExpiry) > new Date;

        if (correctCode && expiryCodeTime) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account verifed successfully"
            }, {
                status: 201
            })
        } else if (!expiryCodeTime) {
            return Response.json({
                success: false,
                message: "Code has expired"
            }, {
                status: 401
            })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect code"
            }, {
                status: 401
            })
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 500
        })
    }
}


