export type AssignmentStatus = "Create" | "On Process" | "Submitted";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  status: AssignmentStatus;
  assignmentDate: string;   // auto-set on creation (ISO datetime)
  dueDate: string;          // YYYY-MM-DD from user
}

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  status?: AssignmentStatus;
  dueDate: string;
}

export interface UpdateAssignmentDTO {
  title?: string;
  description?: string;
  status?: AssignmentStatus;
  dueDate?: string;
}

declare global {
  var __store: Assignment[] | undefined;
}

function getStore(): Assignment[] {
  if (!globalThis.__store) {
    globalThis.__store = [
      {
        id: "asgn-001",
        title: "Build a REST API with Next.js",
        description: "Create a full CRUD REST API using Next.js App Router with Swagger documentation.",
        status: "On Process",
        assignmentDate: "2025-03-01T08:00:00.000Z",
        dueDate: "2025-04-15",
      },
      {
        id: "asgn-002",
        title: "Database Design ERD",
        description: "Design an Entity Relationship Diagram for a university management system.",
        status: "Submitted",
        assignmentDate: "2025-02-20T09:30:00.000Z",
        dueDate: "2025-03-28",
      },
      {
        id: "asgn-003",
        title: "Data Structures Final Project",
        description: "Implement a balanced BST with insert, delete, and search in TypeScript.",
        status: "Create",
        assignmentDate: "2025-03-03T11:00:00.000Z",
        dueDate: "2025-05-01",
      },
    ];
  }
  return globalThis.__store;
}

export function getAllAssignments(): Assignment[] {
  return getStore();
}

export function getAssignmentById(id: string): Assignment | undefined {
  return getStore().find((a) => a.id === id);
}

export function createAssignment(data: CreateAssignmentDTO): Assignment {
  const store = getStore();
  const newItem: Assignment = {
    id: `asgn-${Date.now()}`,
    title: data.title.trim(),
    description: data.description.trim(),
    status: data.status ?? "Create",
    assignmentDate: new Date().toISOString(),
    dueDate: data.dueDate,
  };
  store.push(newItem);
  return newItem;
}

export function updateAssignment(id: string, data: UpdateAssignmentDTO): Assignment | null {
  const store = getStore();
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Assignment = {
    ...store[idx],
    ...(data.title !== undefined && { title: data.title.trim() }),
    ...(data.description !== undefined && { description: data.description.trim() }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
  };
  store[idx] = updated;
  return updated;
}

export function deleteAssignment(id: string): boolean {
  const store = getStore();
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}