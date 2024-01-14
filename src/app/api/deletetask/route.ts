// import { Connect } from "@/db/dbConfig";
import Task from "@/models/todoModel";
import { NextRequest, NextResponse } from "next/server";

// Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id } = reqBody;
    
    // checking if id body is empty
    if (!id) {
      return NextResponse.json({ error: "Id is required." }, { status: 400 });
    }
    
    const token = request.cookies.get("token")?.value || "";

    // BE Call
    const apiResponse = await fetch(process.env.API_HOST + `/api/todo/${id}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    })
    const data = await apiResponse.json()

    return NextResponse.json({
      message: "Task deleted successfully.",
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
