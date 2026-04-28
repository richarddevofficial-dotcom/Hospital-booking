import { z } from "zod";

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number",
    ),

  department: z.enum(
    [
      "cardiology",
      "neurology",
      "orthopedics",
      "pediatrics",
      "dermatology",
      "ophthalmology",
    ],
    {
      errorMap: () => ({ message: "Please select a department" }),
    },
  ),

  preferredDate: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Please select a future date")
    .refine((date) => {
      const selectedDate = new Date(date);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      return selectedDate <= maxDate;
    }, "Appointments can only be booked up to 3 months in advance"),

  message: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export function validateAppointment(data) {
  return appointmentSchema.safeParse(data);
}
