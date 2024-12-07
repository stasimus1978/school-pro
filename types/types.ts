import { Contact, Parent, Prisma, Student } from "@prisma/client";
import { NextRequest } from "next/server";
import { Option } from "react-tailwindcss-select/dist/components/type";

// Base type
export type ContactItem = Contact;
export type ClassItem = Prisma.ClassGetPayload<{ include: { streams: true; students: true } }>;
export type StreamItem = Prisma.StreamGetPayload<{ include: { class: true; students: true } }>;
export type ParentItem = Parent;
export type StudentItem = Student;

// Create types
export type ClassCreateProps = Pick<ClassItem, "title">;
export type StreamCreateProps = Pick<StreamItem, "title" | "slug" | "classId">;
export type ParentCreateProps = Omit<ParentItem, "id">; //& { profileImage: string;};
export type StudentCreateProps = Omit<StudentItem, "id"> & {
  // parentName?: string;
  // classTitle?: string;
  // streamTitle?: string;
};

// Update types (all fields optional except ID)
export type ClassUpdateProps = Partial<ClassCreateProps>;
export type StreamUpdateProps = Partial<StreamCreateProps>;

//

export type SelectOptionProps = Option;

export type TypedRequestBody<T> = Omit<NextRequest, "json"> & {
  json: () => Promise<T>;
};

//
export type StreamWithCount = StreamItem & { _count: { students: number } };
export type ClassWithCountAndStreams = ClassItem & {
  streams: StreamWithCount[];
  _count: { students: number };
};
