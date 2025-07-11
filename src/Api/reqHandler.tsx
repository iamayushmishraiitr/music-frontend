import axios from "axios"
const baseUrl = "https://music-backend-4.onrender.com";
//const baseUrl= "http://localhost:3000";
const request= axios.create({
    baseURL:baseUrl ,
   
})


export {request ,baseUrl} ;