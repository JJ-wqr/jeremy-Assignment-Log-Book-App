import { CreateAssignmentDTO, UpdateAssignmentDTO, AssignmentStatus } from "./store";

const VALID_STATUSES: AssignmentStatus[] = ["Create", "On Process", "Submitted"];

function isValidDate(val: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
}

export interface VError { field: string; message: string; }

export function validateCreate(body: unknown): VError[] {
  const errors: VError[] = [];
  const d = body as Record<string, unknown>;

  if (!d.title || typeof d.title !== "string" || !d.title.trim())
    errors.push({ field: "title", message: "title is required and must be a non-empty string" });

  if (!d.description || typeof d.description !== "string" || !d.description.trim())
    errors.push({ field: "description", message: "description is required and must be a non-empty string" });

  if (!d.dueDate || typeof d.dueDate !== "string")
    errors.push({ field: "dueDate", message: "dueDate is required (format: YYYY-MM-DD)" });
  else if (!isValidDate(d.dueDate))
    errors.push({ field: "dueDate", message: "dueDate must be a valid date in YYYY-MM-DD format" });

  if (d.status !== undefined && !VALID_STATUSES.includes(d.status as AssignmentStatus))
    errors.push({ field: "status", message: `status must be one of: ${VALID_STATUSES.join(", ")}` });

  return errors;
}

export function validateUpdate(body: unknown): VError[] {
  const errors: VError[] = [];
  const d = body as Record<string, unknown>;

  if (Object.keys(d).length === 0) {
    errors.push({ field: "body", message: "Request body must contain at least one field to update" });
    return errors;
  }

  if (d.title !== undefined && (typeof d.title !== "string" || !d.title.trim()))
    errors.push({ field: "title", message: "title must be a non-empty string" });

  if (d.description !== undefined && (typeof d.description !== "string" || !d.description.trim()))
    errors.push({ field: "description", message: "description must be a non-empty string" });

  if (d.dueDate !== undefined && (typeof d.dueDate !== "string" || !isValidDate(d.dueDate)))
    errors.push({ field: "dueDate", message: "dueDate must be a valid date in YYYY-MM-DD format" });

  if (d.status !== undefined && !VALID_STATUSES.includes(d.status as AssignmentStatus))
    errors.push({ field: "status", message: `status must be one of: Create, On Process, Submitted` });

  return errors;
}

export function toCreateDTO(b: Record<string, unknown>): CreateAssignmentDTO {
  return {
    title: b.title as string,
    description: b.description as string,
    dueDate: b.dueDate as string,
    status: b.status as AssignmentStatus | undefined,
  };
}

export function toUpdateDTO(b: Record<string, unknown>): UpdateAssignmentDTO {
  const dto: UpdateAssignmentDTO = {};
  if (b.title !== undefined) dto.title = b.title as string;
  if (b.description !== undefined) dto.description = b.description as string;
  if (b.dueDate !== undefined) dto.dueDate = b.dueDate as string;
  if (b.status !== undefined) dto.status = b.status as AssignmentStatus;
  return dto;
}