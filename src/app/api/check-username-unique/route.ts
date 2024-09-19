import {z} from 'zod';
import UserModel from '@/model/User';
import dbconnect from '@/lib/dbconnect';
import { signUpSchema } from '@/schemas/signUpSchema';
import { UsernameValidation } from '@/schemas/signUpSchema';


const UsernameQuerySchema = z.object({
    username:UsernameValidation,
})
export async function GET(request:Request){
   await dbconnect();

   try {
    const { searchParams }= new URL(request.url);
    const  qureyParams  = {
        username:searchParams.get('username')
    }
   
    const result = UsernameQuerySchema.safeParse(qureyParams)
    

    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json(
            {
              success: false,
              message:
                usernameErrors?.length > 0
                  ? usernameErrors.join(', ')
                  : 'Invalid query parameters',
            },
            { status: 400 }
          );

    }

    const {username} = result.data;

    const existingVerifedUser = await UserModel.findOne({
        username,
        isVerified:true,
    })
    if(existingVerifedUser){
   return Response.json({
    success:false,
    message:"Username already taken"
   },{
    status:500
   }) 
    }

    return Response.json({
        success:true,
        message:"Username is unique"
       },{
        status:200
       })
    

    
   } catch (error) {
    console.error("username is not unique", error);
    return Response.json({
        success:false,
        message:"username is not unique"
    },{
        status:500
    })
    
   }
}