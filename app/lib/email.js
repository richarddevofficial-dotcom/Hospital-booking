import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const departmentLabels = {
  cardiology: "Cardiology",
  neurology: "Neurology",
  orthopedics: "Orthopedics",
  pediatrics: "Pediatrics",
  dermatology: "Dermatology",
  ophthalmology: "Ophthalmology",
};

export async function sendAppointmentEmail(data) {
  const hospitalEmail = process.env.HOSPITAL_EMAIL;
  const hospitalName = process.env.HOSPITAL_NAME || "CarePlus Medical Center";

  if (!hospitalEmail) {
    throw new Error("Hospital email not configured");
  }

  const formattedDate = new Date(data.preferredDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  try {
    // Send email to hospital
    await resend.emails.send({
      from: `${hospitalName} <appointments@yourdomain.com>`,
      to: hospitalEmail,
      subject: `New Appointment Booking - ${data.fullName}`,
      html: generateHospitalEmailHTML(data, formattedDate, hospitalName),
    });

    // Send confirmation to patient
    await resend.emails.send({
      from: `${hospitalName} <appointments@yourdomain.com>`,
      to: data.email,
      subject: `Appointment Confirmation - ${hospitalName}`,
      html: generatePatientConfirmationHTML(data, formattedDate, hospitalName),
    });

    return { success: true, message: "Appointment booked successfully" };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send confirmation emails");
  }
}

function generateHospitalEmailHTML(data, formattedDate, hospitalName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #111827; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Appointment Booking</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Patient Name:</div>
            <div class="value">${data.fullName}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone}</div>
          </div>
          <div class="field">
            <div class="label">Department:</div>
            <div class="value">${departmentLabels[data.department]}</div>
          </div>
          <div class="field">
            <div class="label">Preferred Date:</div>
            <div class="value">${formattedDate}</div>
          </div>
          ${
            data.message
              ? `
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message}</div>
          </div>
          `
              : ""
          }
        </div>
        <div class="footer">
          <p>This is an automated notification from ${hospitalName}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePatientConfirmationHTML(data, formattedDate, hospitalName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Request Received</h1>
        </div>
        <div class="content">
          <p>Dear ${data.fullName},</p>
          <p>Thank you for requesting an appointment at ${hospitalName}. We have received your booking request for:</p>
          <p><strong>Department:</strong> ${departmentLabels[data.department]}</p>
          <p><strong>Preferred Date:</strong> ${formattedDate}</p>
          <p>Our team will review your request and contact you shortly at ${data.phone} or ${data.email} to confirm your appointment.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>${hospitalName} Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
