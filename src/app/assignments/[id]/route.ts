import { NextRequest } from "next/server";
import { getAssignmentById, updateAssignment, deleteAssignment } from "@/lib/store";
import { validateUpdate, toUpdateDTO } from "@/lib/validate";
import { ok, notFound, validationError, badRequest, serverError } from "@/lib/response";

interface Ctx { params: { id: string }; }

// GET /api/assignments/:id
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const a = getAssignmentById(params.id);
    if (!a) return notFound("Assignment not found");
    return ok(a);
  } catch (e) { return serverError(e); }
}

// PUT /api/assignments/:id
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    if (!getAssignmentById(params.id)) return notFound("Assignment not found");

    let body: unknown;
    try { body = await req.json(); }
    catch { return badRequest("Request body must be valid JSON"); }

    const errors = validateUpdate(body);
    if (errors.length > 0) return validationError(errors);

    const updated = updateAssignment(params.id, toUpdateDTO(body as Record<string, unknown>));
    return ok(updated);
  } catch (e) { return serverError(e); }
}

// DELETE /api/assignments/:id
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const a = getAssignmentById(params.id);
    if (!a) return notFound("Assignment not found");
    deleteAssignment(params.id);
    return ok({ message: `Assignment "${a.title}" deleted successfully.`, deletedId: params.id });
  } catch (e) { return serverError(e); }
}