import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";

    // BE Call
    const apiResponse = await fetch(process.env.API_HOST + `/api/todo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    })
    const data = await apiResponse.json()

    console.log('route apiData ', JSON.stringify(data));

    return NextResponse.json({
      message: "Task loaded successfully.",
      success: true,
      data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
