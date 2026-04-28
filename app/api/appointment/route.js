import { NextResponse } from "next/server";
import { validateAppointment } from "@/app/lib/validation";
import { sendAppointmentEmail } from "@/app/lib/email";
import { checkRateLimit } from "@/app/lib/rate-limit";
import DOMPurify from "isomorphic-dompurify";

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = checkRateLimit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const validationResult = validateAppointment(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // Sanitize inputs
    const sanitizedData = {
      fullName: DOMPurify.sanitize(validatedData.fullName),
      email: DOMPurify.sanitize(validatedData.email),
      phone: DOMPurify.sanitize(validatedData.phone),
      department: validatedData.department,
      preferredDate: validatedData.preferredDate,
      message: validatedData.message
        ? DOMPurify.sanitize(validatedData.message)
        : undefined,
    };

    // Send emails
    await sendAppointmentEmail(sanitizedData);

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        data: {
          name: sanitizedData.fullName,
          department: sanitizedData.department,
          date: sanitizedData.preferredDate,
        },
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      },
    );
  } catch (error) {
    console.error("Appointment booking error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { error: "Failed to process appointment", details: errorMessage },
      { status: 500 },
    );
  }
}
