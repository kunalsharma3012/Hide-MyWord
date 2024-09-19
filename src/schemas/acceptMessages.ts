import {z} from 'zod'

export const acceptmessagesSchema = z.object({
    acceptMessages:z.boolean()
})