import { aj } from "@/config/ArcJet";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = await currentUser();
  let token;
  try {
    const body = await req.json();
    token = body.token;
  } catch {
    token = null;
  }
  if (token) {
    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress,
      requested: token, // Deduct 1 token for each message sent
    }); 
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", 
          reason: decision.reason, 
          remainingToken: decision.reason.remaining || 0 },
        { status: 429 },
      );  
    }
    return NextResponse.json({allowed: true, remainingToken: decision.reason.remaining || 0 });
  }
  else {
  const decision = await aj.protect(req, {
     userId: user?.primaryEmailAddress?.emailAddress,
      requested: 0 }); // Deduct 5 tokens from the bucket
  console.log("Arcjet decision", decision.reason.remaining);
  const remainingToken = decision.reason.remaining || 0;

  return NextResponse.json({ remainingToken: remainingToken });
  }
}