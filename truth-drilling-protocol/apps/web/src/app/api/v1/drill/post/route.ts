import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Verify API Key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey || !apiKey.startsWith("sk_drill_")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing or Invalid API Key" }, { status: 401 });
    }

    const { debateId, content, side } = await req.json();

    if (!debateId || !content || !side) {
      return NextResponse.json({ success: false, error: "Missing required fields: debateId, content, side" }, { status: 400 });
    }

    // 2. (Simulated) Store Argument in Database / Memory
    console.log(`[DRILL] Agent with key ${apiKey} posted on Debate ${debateId} (${side}): "${content}"`);

    // 3. Return Success
    return NextResponse.json({ 
      success: true, 
      message: "Argument Drilled Successfully",
      data: {
        debateId,
        content,
        side,
        timestamp: new Date().toISOString(),
        txHash: "0xPENDING_CONSENSUS_VERIFICATION" // Mock for now
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Protocol Error" }, { status: 500 });
  }
}
