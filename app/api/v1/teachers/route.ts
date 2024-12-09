// import { convertDateToISO } from "@/lib/convertDateToIso";
import prisma from "@/lib/prisma";
import { TeacherCreateProps, TypedRequestBody } from "@/types/types";
import { NextRequest } from "next/server";

function convertDateToISO(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD");
  }

  const prismaDateTime = `${dateStr}T00:00:00.000Z`;

  return prismaDateTime;
}

// Create
export async function POST(request: TypedRequestBody<TeacherCreateProps>) {
  const data = await request.json();

  const { NIN, phone, email, dateOfBirth, dateOfJoining } = data;

  data.dateOfBirth = new Date(convertDateToISO(dateOfBirth?.toString()));
  data.dateOfJoining = new Date(convertDateToISO(dateOfJoining?.toString()));

  try {
    const exitingEmail = await prisma.teacher.findUnique({
      where: { email },
    });

    const exitingNIN = await prisma.teacher.findUnique({
      where: { NIN },
    });

    const exitingPhone = await prisma.teacher.findUnique({
      where: { phone },
    });

    if (exitingNIN) {
      return new Response(JSON.stringify({ error: "Teacher with NIN already exists", data: null }), {
        status: 409,
        // headers: { "Content-Type": "application/json" },
      });
    }

    if (exitingEmail) {
      return new Response(JSON.stringify({ error: "Teacher with Email already exists", data: null }), {
        status: 409,
        // headers: { "Content-Type": "application/json" },
      });
    }

    if (exitingPhone) {
      return new Response(JSON.stringify({ error: "Teacher with Phone already exists", data: null }), {
        status: 409,
        // headers: { "Content-Type": "application/json" },
      });
    }

    const newTeacher = await prisma.teacher.create({
      data,
    });

    console.log(`Teacher created successfully: ${newTeacher.firstName} (${newTeacher.id})`);

    return new Response(JSON.stringify({ data: newTeacher, error: null }), {
      status: 201,
      // headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Something went wrong", data: null }), {
      status: 500,
      // headers: { "Content-Type": "application/json" },
    });
  }
}

//  Get
export async function GET(request: NextRequest) {
  try {
    const parents = await prisma.parent.findMany({
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify({ data: parents, error: null }), {
      status: 200,
      // headers: { "Content-Type": "application/json" },
    });
  } catch (error) {}
}