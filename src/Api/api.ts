import { baseUrl } from "./reqHandler";

export const apis = {
  SIGN_UP: `${baseUrl}/signup`,
  SIGN_IN: `${baseUrl}/signin`,
  POST_STREAM : `${baseUrl}/stream/postStreams`,
  GET_STREAM:`${baseUrl}/stream/getStreams`,
  GET_CURRENT_STREAM:`${baseUrl}/stream/getCurrentStream`,
  PlAY_NEXT :`${baseUrl}/stream/playNext`,
  UP_VOTE:`${baseUrl}/stream/upVote`,
  DOWN_VOTES:`${baseUrl}/stream/downVote`,
  GET_SPACES:`${baseUrl}/space/getSpaces`,
  CREATE_SPACES:`${baseUrl}/space/createSpace`,
  
};
