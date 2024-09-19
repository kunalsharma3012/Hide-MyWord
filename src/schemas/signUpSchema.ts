import { z } from 'zod'

export const UsernameValidation = z
.string()
.min(2,"username should be greater than 2")
.max(20,"username can't be greater than 20")
.regex(/^[a-zA-Z0-9_]+$/,"username must contain speacial character")


export const signUpSchema = z.object({
    username:UsernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password atleast contain 6 character"})

})
