// import { Connect } from "@/db/dbConfig";
import Task from "@/models/todoModel";
import { NextRequest, NextResponse } from "next/server";

// Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title } = reqBody;
    
    // //checking is task body is empty
    if (!title) {
      return NextResponse.json({ error: "Task is required." }, { status: 400 });
    }
    
    const token = request.cookies.get("token")?.value || "";

    // BE Call
    const apiResponse = await fetch(process.env.API_HOST + `/api/todo`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({
        title: title,
        description: 'N/A',
      }),
    })
    const data = await apiResponse.json()

    // const userTask = new Task({ title });
    // const savedUser = await userTask.save();
    // console.log(savedUser);

    return NextResponse.json({
      message: "Task added successfully.",
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
