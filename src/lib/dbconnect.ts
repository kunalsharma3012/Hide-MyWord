import mongoose from "mongoose";

type ConnectionObject = {
    //Making it optional
    isconnected? : number;
}

const connection : ConnectionObject = {

}

//here void means data type can be of any type 
async function dbconnect() : Promise<void> {
 if(connection.isconnected){
    console.log("DB already connected");
    return ;
    
 }
 try{
    const db = await mongoose.connect(process.env.MONGODB_URI || "" ,{})

    connection.isconnected = db.connections[0].readyState

    console.log("DB connected sucessfully");
    

 }catch(error){
    console.log("Database connection failed" , error);
    process.exit(1);
    
 }
}

export default dbconnect;