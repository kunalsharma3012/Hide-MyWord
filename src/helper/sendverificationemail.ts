import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationemail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {


        const { data, error } = await resend.emails.send({
            from:"Acme <onreply@kunalsharma.xyz>",
            to: [email],
            subject: 'Msytery message | Verification code',
            react: VerificationEmail({ username, otp: verifyCode }) as React.ReactElement,
        });

        if(error){
            console.log(error);
            
            return { success:false , message:"error in sending verification code"}
        }
        console.log(data);

        return { success: true, message: "Verfication email send successfully" }
    } catch (emailError) {
        console.log("Error sending verification Email", emailError);
        return { success: false, message: "Failed to send verfication email" }

    }

}