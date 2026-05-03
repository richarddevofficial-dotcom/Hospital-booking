/**
 * WhatsApp integration using Twilio
 * Send WhatsApp messages to hospital about new appointments
 */

const departmentLabels = {
  cardiology: "❤️ Cardiology",
  neurology: "🧠 Neurology",
  orthopedics: "🦴 Orthopedics",
  pediatrics: "👶 Pediatrics",
  dermatology: "🔬 Dermatology",
  ophthalmology: "👁️ Ophthalmology",
};

export async function sendWhatsAppNotification(data) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  const hospitalWhatsAppNumber = process.env.HOSPITAL_WHATSAPP_NUMBER;

  // Check if WhatsApp is configured
  if (
    !accountSid ||
    !authToken ||
    !twilioWhatsAppNumber ||
    !hospitalWhatsAppNumber
  ) {
    console.warn("⚠️ WhatsApp not configured. Skipping WhatsApp notification.");
    return { success: false, reason: "WhatsApp not configured" };
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
    // Dynamic import to avoid issues if Twilio is not installed
    const twilio = await import("twilio");
    const client = twilio.default(accountSid, authToken);

    const messageBody = generateWhatsAppMessage(data, formattedDate);

    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${hospitalWhatsAppNumber}`,
      body: messageBody,
    });

    console.log("✅ WhatsApp notification sent:", message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("❌ WhatsApp sending failed:", error);
    throw new Error(`WhatsApp notification failed: ${error.message}`);
  }
}

function generateWhatsAppMessage(data, formattedDate) {
  return `
🏥 *NEW APPOINTMENT REQUEST*
━━━━━━━━━━━━━━━━━━

👤 *Patient:* ${data.fullName}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone}
🏥 *Department:* ${departmentLabels[data.department]}
📅 *Preferred Date:* ${formattedDate}
${data.message ? `📝 *Message:* ${data.message}` : ""}

━━━━━━━━━━━━━━━━━━
⏰ *Status:* Pending Confirmation
📋 *Action Required:* Contact patient within 24 hours

_Powered by CarePlus Medical Center_
  `.trim();
}

/**
 * Send WhatsApp confirmation to patient (Optional)
 */
export async function sendPatientWhatsAppConfirmation(data) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !twilioWhatsAppNumber) {
    console.warn(
      "⚠️ Cannot send patient WhatsApp confirmation - not configured",
    );
    return { success: false, reason: "WhatsApp not configured" };
  }

  try {
    const twilio = await import("twilio");
    const client = twilio.default(accountSid, authToken);

    const patientMessage = `
✅ *Appointment Request Received!*

Dear ${data.fullName},

Your appointment request at CarePlus Medical Center has been received.

🏥 *Department:* ${departmentLabels[data.department]}
📅 *Preferred Date:* ${new Date(data.preferredDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    )}

We will contact you shortly at ${data.phone} to confirm your appointment.

Thank you for choosing CarePlus Medical Center! 🏥
    `.trim();

    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${data.phone.replace(/[^0-9]/g, "")}`, // Clean phone number
      body: patientMessage,
    });

    console.log("✅ Patient WhatsApp confirmation sent");
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("❌ Patient WhatsApp failed:", error);
    // Don't throw error - WhatsApp to patient is optional
    return { success: false, reason: error.message };
  }
}
