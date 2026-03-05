import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.0",
  info: {
    title: "Jeremy Assignment LogBook API",
    version: "1.0.0",
    description: "REST API for managing student assignments. Built with Next.js 14 App Router.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local Dev" }],
  tags: [{ name: "Assignments", description: "Assignment CRUD operations" }],
  components: {
    schemas: {
      Assignment: {
        type: "object",
        properties: {
          id: { type: "string", example: "asgn-001" },
          title: { type: "string", example: "Build a REST API" },
          description: { type: "string", example: "Create CRUD endpoints with Next.js" },
          status: { type: "string", enum: ["Create", "On Process", "Submitted"], example: "On Process" },
          assignmentDate: { type: "string", format: "date-time", description: "Auto-generated on creation", example: "2025-03-01T08:00:00.000Z" },
          dueDate: { type: "string", format: "date", description: "User-selected due date (YYYY-MM-DD)", example: "2025-04-15" },
        },
      },
      CreateRequest: {
        type: "object",
        required: ["title", "description", "dueDate"],
        properties: {
          title: { type: "string", example: "Operating Systems Essay" },
          description: { type: "string", example: "Write about Linux vs Windows." },
          dueDate: { type: "string", format: "date", example: "2025-05-10" },
          status: { type: "string", enum: ["Create", "On Process", "Submitted"], default: "Create" },
        },
      },
      UpdateRequest: {
        type: "object",
        description: "All fields optional; at least one required.",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string", format: "date" },
          status: { type: "string", enum: ["Create", "On Process", "Submitted"] },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Assignment" },
        },
      },
      SuccessListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              total: { type: "integer", example: 3 },
              assignments: { type: "array", items: { $ref: "#/components/schemas/Assignment" } },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              message: { type: "string", example: "Validation failed" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "title" },
                    message: { type: "string", example: "title is required" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/assignments": {
      get: {
        tags: ["Assignments"],
        summary: "List all assignments",
        operationId: "listAssignments",
        parameters: [{
          name: "status", in: "query", required: false,
          schema: { type: "string", enum: ["Create", "On Process", "Submitted"] },
          description: "Filter by status",
        }],
        responses: {
          "200": { description: "✅ Success", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessListResponse" } } } },
          "500": { description: "❌ Server Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Assignments"],
        summary: "Create a new assignment",
        operationId: "createAssignment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRequest" },
              examples: {
                "✅ Minimum fields": {
                  summary: "✅ Success — Minimum required fields",
                  value: { title: "Operating Systems Essay", description: "Write a 3000-word essay on Linux vs Windows.", dueDate: "2025-05-10" },
                },
                "✅ All fields": {
                  summary: "✅ Success — With status",
                  value: { title: "Machine Learning Report", description: "Train a CNN on CIFAR-10.", dueDate: "2025-06-01", status: "On Process" },
                },
                "❌ Missing title": {
                  summary: "❌ Error 422 — Missing title",
                  value: { description: "Some description", dueDate: "2025-05-10" },
                },
                "❌ Missing dueDate": {
                  summary: "❌ Error 422 — Missing dueDate",
                  value: { title: "Test", description: "Some description" },
                },
                "❌ Invalid date": {
                  summary: "❌ Error 422 — Wrong date format",
                  value: { title: "Test", description: "Some description", dueDate: "10-05-2025" },
                },
                "❌ Invalid status": {
                  summary: "❌ Error 422 — Invalid status",
                  value: { title: "Test", description: "Some description", dueDate: "2025-05-10", status: "done" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "✅ Created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "400": { description: "❌ Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "422": { description: "❌ Validation Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "❌ Server Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/assignments/{id}": {
      get: {
        tags: ["Assignments"],
        summary: "Get assignment by ID",
        operationId: "getAssignmentById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, example: "asgn-001" }],
        responses: {
          "200": { description: "✅ Success", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "404": { description: "❌ Not Found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "❌ Server Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Assignments"],
        summary: "Update an assignment",
        operationId: "updateAssignment",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, example: "asgn-001" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRequest" },
              examples: {
                "✅ Mark Submitted": { summary: "✅ Success — Mark as Submitted", value: { status: "Submitted" } },
                "✅ Multi-field": { summary: "✅ Success — Multiple fields", value: { title: "Updated Title", dueDate: "2025-06-15", status: "On Process" } },
                "❌ Empty body": { summary: "❌ Error 422 — Empty body", value: {} },
                "❌ Invalid status": { summary: "❌ Error 422 — Invalid status", value: { status: "finished" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "✅ Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "404": { description: "❌ Not Found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "422": { description: "❌ Validation Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "❌ Server Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Assignments"],
        summary: "Delete an assignment",
        operationId: "deleteAssignment",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, example: "asgn-001" }],
        responses: {
          "200": {
            description: "✅ Deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        message: { type: "string", example: "Assignment deleted successfully." },
                        deletedId: { type: "string", example: "asgn-001" },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": { description: "❌ Not Found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "❌ Server Error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}