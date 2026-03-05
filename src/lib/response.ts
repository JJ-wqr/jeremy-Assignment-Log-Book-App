import { NextResponse } from "next/server";
import { VError } from "./validate";

export const ok = <T>(data: T) =>
  NextResponse.json({ success: true, data }, { status: 200 });

export const created = <T>(data: T) =>
  NextResponse.json({ success: true, data }, { status: 201 });

export const notFound = (msg = "Resource not found") =>
  NextResponse.json({ success: false, error: { message: msg } }, { status: 404 });

export const validationError = (errors: VError[]) =>
  NextResponse.json(
    { success: false, error: { message: "Validation failed", details: errors } },
    { status: 422 }
  );

export const badRequest = (msg: string) =>
  NextResponse.json({ success: false, error: { message: msg } }, { status: 400 });

export const serverError = (e?: unknown) => {
  console.error(e);
  return NextResponse.json(
    { success: false, error: { message: "Internal server error" } },
    { status: 500 }
  );
};