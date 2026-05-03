import { Resend } from "resend";
import nodemailer from "nodemailer";

const departmentLabels = {
  cardiology: "Cardiology",
  neurology: "Neurology",
  orthopedics: "Orthopedics",
  pediatrics: "Pediatrics",
  dermatology: "Dermatology",
  ophthalmology: "Ophthalmology",
};

/**
 * Send email using Resend (Primary method)
 */
async function sendWithResend(
  data,
  hospitalEmail,
  hospitalName,
  formattedDate,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Send to hospital
  const hospitalEmailResult = await resend.emails.send({
    from: `${hospitalName} <appointments@yourdomain.com>`,
    to: hospitalEmail,
    subject: `🔔 New Appointment Booking - ${data.fullName}`,
    html: generateHospitalEmailHTML(data, formattedDate, hospitalName),
    tags: [{ name: "category", value: "appointment" }],
  });

  // Send confirmation to patient
  const patientEmailResult = await resend.emails.send({
    from: `${hospitalName} <appointments@yourdomain.com>`,
    to: data.email,
    subject: `✅ Appointment Confirmation - ${hospitalName}`,
    html: generatePatientConfirmationHTML(data, formattedDate, hospitalName),
    tags: [{ name: "category", value: "confirmation" }],
  });

  return { hospitalEmailResult, patientEmailResult };
}

/**
 * Send email using Nodemailer (Fallback method)
 */
async function sendWithNodemailer(
  data,
  hospitalEmail,
  hospitalName,
  formattedDate,
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send to hospital
  const hospitalMailOptions = {
    from: `"${hospitalName}" <${process.env.SMTP_USER}>`,
    to: hospitalEmail,
    subject: `🔔 New Appointment Booking - ${data.fullName}`,
    html: generateHospitalEmailHTML(data, formattedDate, hospitalName),
  };

  // Send confirmation to patient
  const patientMailOptions = {
    from: `"${hospitalName}" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `✅ Appointment Confirmation - ${hospitalName}`,
    html: generatePatientConfirmationHTML(data, formattedDate, hospitalName),
  };

  await transporter.sendMail(hospitalMailOptions);
  await transporter.sendMail(patientMailOptions);
}

/**
 * Main email sending function
 */
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
    // Try Resend first, fallback to Nodemailer
    if (process.env.RESEND_API_KEY) {
      console.log("📧 Sending emails via Resend...");
      const result = await sendWithResend(
        data,
        hospitalEmail,
        hospitalName,
        formattedDate,
      );
      console.log("✅ Emails sent via Resend");
      return { success: true, method: "resend" };
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log("📧 Sending emails via Nodemailer SMTP...");
      await sendWithNodemailer(
        data,
        hospitalEmail,
        hospitalName,
        formattedDate,
      );
      console.log("✅ Emails sent via Nodemailer");
      return { success: true, method: "nodemailer" };
    } else {
      console.warn("⚠️ Email configuration missing. Skipping email sending.");
      return { success: false, method: "none", reason: "Email not configured" };
    }
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function generateHospitalEmailHTML(data, formattedDate, hospitalName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e40af, #1d4ed8); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .urgent-badge { display: inline-block; background: #fee2e2; color: #991b1b; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
        .content { padding: 30px 20px; background-color: #ffffff; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; }
        .info-table td:first-child { font-weight: bold; color: #374151; width: 40%; }
        .info-table td:last-child { color: #111827; }
        .message-box { background: #f3f4f6; padding: 15px; border-left: 4px solid #1d4ed8; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .action-buttons { margin-top: 20px; text-align: center; }
        .btn { display: inline-block; padding: 12px 24px; margin: 5px; border-radius: 8px; text-decoration: none; font-weight: bold; }
        .btn-confirm { background: #059669; color: white; }
        .btn-contact { background: #1d4ed8; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Appointment Request</h1>
          <div class="urgent-badge">ACTION REQUIRED</div>
        </div>
        <div class="content">
          <table class="info-table">
            <tr>
              <td>👤 Patient Name</td>
              <td>${data.fullName}</td>
            </tr>
            <tr>
              <td>📧 Email</td>
              <td>${data.email}</td>
            </tr>
            <tr>
              <td>📱 Phone</td>
              <td>${data.phone}</td>
            </tr>
            <tr>
              <td>🏥 Department</td>
              <td><strong>${departmentLabels[data.department]}</strong></td>
            </tr>
            <tr>
              <td>📅 Preferred Date</td>
              <td>${formattedDate}</td>
            </tr>
          </table>
          
          ${
            data.message
              ? `
          <div class="message-box">
            <strong>📝 Patient Message:</strong><br>
            ${data.message}
          </div>
          `
              : ""
          }
          
          <div class="action-buttons">
            <a href="tel:${data.phone}" class="btn btn-confirm">📞 Call Patient</a>
            <a href="mailto:${data.email}" class="btn btn-contact">✉️ Email Patient</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from ${hospitalName} Appointment System</p>
          <p>Appointment ID: ${data._id || "N/A"}</p>
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
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; background-color: #ffffff; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .info-table td:first-child { font-weight: bold; color: #374151; }
        .next-steps { background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Appointment Request Received!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${data.fullName}</strong>,</p>
          <p>Thank you for choosing <strong>${hospitalName}</strong>. Your appointment request has been received successfully!</p>
          
          <table class="info-table">
            <tr>
              <td>Department</td>
              <td>${departmentLabels[data.department]}</td>
            </tr>
            <tr>
              <td>Preferred Date</td>
              <td>${formattedDate}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td><span style="color: #f59e0b;">⏳ Pending Confirmation</span></td>
            </tr>
          </table>
          
          <div class="next-steps">
            <h3>What's Next?</h3>
            <ol>
              <li>Our team will review your request</li>
              <li>We'll contact you at <strong>${data.phone}</strong> within 24 hours</li>
              <li>You'll receive a final appointment confirmation</li>
            </ol>
          </div>
          
          <p>If you need to make any changes or have questions, please contact us:</p>
          <p>📞 Phone: +1 (555) 123-4567</p>
          <p>📧 Email: ${process.env.HOSPITAL_EMAIL}</p>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>${hospitalName} Team</strong></p>
          <p>This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
