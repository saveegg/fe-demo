// import { Connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";

// Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // BE Call
    const apiResponse = await fetch(process.env.API_HOST + `/api/auth/signin`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    const apiData = await apiResponse.json()

    //checking if user exists
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return NextResponse.json(
    //     { error: "User not found. Please check your email and try again." },
    //     { status: 400 }
    //   );
    // }
    // console.log(user);

    //check if password is correct
    // const validPassword = await bcryptjs.compare(password, user.password);
    // if (!validPassword) {
    //   return NextResponse.json(
    //     { error: "Invalid password. Please enter the correct password." },
    //     { status: 400 }
    //   );
    // }

    //creating token data
    // const tokenData = {
    //   id: user._id,
    //   username: user.username,
    //   email: user.email,
    // };

    //creating token
    // const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY!, {
    //   expiresIn: "1h",
    // });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    //sending token to user cookies
    if (apiData.accessToken) {
      response.cookies.set("token", apiData.accessToken, { httpOnly: true });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "An error occurred during login. Please try again later.",
      },
      { status: 500 }
    );
  }
}
