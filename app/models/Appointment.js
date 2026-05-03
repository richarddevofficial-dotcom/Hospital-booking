import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: [
          "cardiology",
          "neurology",
          "orthopedics",
          "pediatrics",
          "dermatology",
          "ophthalmology",
        ],
        message: "{VALUE} is not a valid department",
      },
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
      validate: {
        validator: function (value) {
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Please select a future date",
      },
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message must be less than 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    whatsappSent: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
