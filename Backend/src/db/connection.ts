export const connectToDatabase=async()=>{
    try{
        await connect (process.env.MONGODB_URL);
    } catch (error){
        console.log(error);
        throw new Error('Failed to connect to Database');
    }
}