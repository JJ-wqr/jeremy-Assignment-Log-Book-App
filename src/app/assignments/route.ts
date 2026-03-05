import { NextRequest } from "next/server";
import { getAllAssignments, createAssignment } from "@/lib/store";
import { validateCreate, toCreateDTO } from "@/lib/validate";
import { ok, created, validationError, badRequest, serverError } from "@/lib/response";

// GET /api/assignments
// Query params: ?status=Create|On Process|Submitted
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    let list = getAllAssignments();
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    return ok({ total: list.length, assignments: list });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/assignments
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try { body = await req.json(); }
    catch { return badRequest("Request body must be valid JSON"); }

    const errors = validateCreate(body);
    if (errors.length > 0) return validationError(errors);

    const assignment = createAssignment(toCreateDTO(body as Record<string, unknown>));
    return created(assignment);
  } catch (e) {
    return serverError(e);
  }
}