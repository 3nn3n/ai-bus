 import axios from "axios";
import { NextResponse } from "next/server";
  
 export async function POST(request) {

  const {model, msg, parentModel} = await request.json();


  /* Send POST request using Axios */
  const response = await axios.post(
    "https://kravixstudio.com/api/v1/chat",
    {
      message: msg, // Messages to AI
      aiModel: model,                     // Selected AI model
      outputType: "text"                         // 'text' or 'json'
    },
    {
      headers: {
        "Content-Type": "application/json",     // Tell server we're sending JSON
        "Authorization": `Bearer ${process.env.KRAVIX_STUDIO_API_KEY}`  // Use API key from environment variable
      }
    }
  );
  
  console.log(response.data); // Log API response
  return NextResponse.json({
    ...response.data,
    parentModel: parentModel,
  })
}