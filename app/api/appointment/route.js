import { NextResponse } from "next/server";
import { validateAppointment } from "@/app/lib/validation";
import { sendAppointmentEmail } from "@/app/lib/email";
import {
  sendWhatsAppNotification,
  sendPatientWhatsAppConfirmation,
} from "@/app/lib/whatsapp";
import { checkRateLimit } from "@/app/lib/rate-limit";
import { connectDB } from "@/app/lib/db";
import Appointment from "@/app/models/Appointment";
import DOMPurify from "isomorphic-dompurify";

export async function POST(request) {
  const startTime = Date.now();

  try {
    // 1. Rate Limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitResult = checkRateLimit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: "60 seconds",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(Date.now() + 60000).toISOString(),
          },
        },
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // 3. Validate input
    const validationResult = validateAppointment(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }));

      return NextResponse.json(
        {
          error: "Validation failed",
          errors,
          message: "Please check your input and try again.",
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // 4. Sanitize inputs
    const sanitizedData = {
      fullName: DOMPurify.sanitize(validatedData.fullName),
      email: DOMPurify.sanitize(validatedData.email),
      phone: DOMPurify.sanitize(validatedData.phone),
      department: validatedData.department,
      preferredDate: new Date(validatedData.preferredDate),
      message: validatedData.message
        ? DOMPurify.sanitize(validatedData.message)
        : "",
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || "Unknown",
    };

    // 5. Connect to database
    await connectDB();

    // 6. Save to database
    const appointment = new Appointment(sanitizedData);
    await appointment.save();
    console.log("💾 Appointment saved to database:", appointment._id);

    // 7. Send notifications in parallel (non-blocking)
    const notificationPromises = [];
    const notificationResults = {};

    // Send email notification
    notificationPromises.push(
      sendAppointmentEmail({ ...sanitizedData, _id: appointment._id })
        .then((result) => {
          notificationResults.email = { success: true, ...result };
          // Update database
          return Appointment.findByIdAndUpdate(appointment._id, {
            emailSent: true,
          });
        })
        .catch((error) => {
          console.error("Email notification failed:", error);
          notificationResults.email = { success: false, error: error.message };
        }),
    );

    // Send WhatsApp notification to hospital
    notificationPromises.push(
      sendWhatsAppNotification(sanitizedData)
        .then((result) => {
          notificationResults.whatsapp = { success: true, ...result };
          return Appointment.findByIdAndUpdate(appointment._id, {
            whatsappSent: true,
          });
        })
        .catch((error) => {
          console.error("WhatsApp notification failed:", error);
          notificationResults.whatsapp = {
            success: false,
            error: error.message,
          };
        }),
    );

    // Send WhatsApp confirmation to patient (optional)
    notificationPromises.push(
      sendPatientWhatsAppConfirmation(sanitizedData)
        .then((result) => {
          notificationResults.patientWhatsapp = result;
        })
        .catch((error) => {
          notificationResults.patientWhatsapp = {
            success: false,
            error: error.message,
          };
        }),
    );

    // Wait for all notifications to complete
    await Promise.allSettled(notificationPromises);

    // 8. Log performance
    const duration = Date.now() - startTime;
    console.log(`⏱️ Request processed in ${duration}ms`);

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        message:
          "Appointment booked successfully. We will contact you within 24 hours.",
        data: {
          appointmentId: appointment._id,
          name: sanitizedData.fullName,
          department: sanitizedData.department,
          preferredDate: sanitizedData.preferredDate,
          status: appointment.status,
        },
        notifications: notificationResults,
        processingTime: `${duration}ms`,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-Response-Time": `${duration}ms`,
        },
      },
    );
  } catch (error) {
    // Comprehensive error logging
    const duration = Date.now() - startTime;
    console.error("❌ Appointment booking error:", {
      message: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    // Handle specific error types
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return NextResponse.json(
        { error: "Database validation failed", errors },
        { status: 400 },
      );
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
      return NextResponse.json(
        {
          error: "Duplicate appointment detected",
          message: "An appointment with these details already exists.",
        },
        { status: 409 },
      );
    }

    if (error.name === "MongooseError" || error.name === "MongoNetworkError") {
      return NextResponse.json(
        {
          error: "Database connection error",
          message: "Unable to save appointment. Please try again.",
        },
        { status: 503 },
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to process appointment",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}

// GET endpoint to check appointment status (optional)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");
    const email = searchParams.get("email");

    if (!appointmentId && !email) {
      return NextResponse.json(
        { error: "Please provide appointment ID or email" },
        { status: 400 },
      );
    }

    await connectDB();

    let query = {};
    if (appointmentId) {
      query._id = appointmentId;
    } else if (email) {
      query.email = email.toLowerCase();
    }

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    if (!appointments.length) {
      return NextResponse.json(
        { error: "No appointments found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
