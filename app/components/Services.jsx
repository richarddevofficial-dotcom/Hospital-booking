"use client";

import { motion } from "framer-motion";

const services = [
  {
    icon: "❤️",
    title: "Cardiology",
    description:
      "Comprehensive heart care with advanced diagnostic and treatment options.",
    color: "bg-red-100",
  },
  {
    icon: "🧠",
    title: "Neurology",
    description:
      "Expert care for neurological disorders with cutting-edge technology.",
    color: "bg-purple-100",
  },
  {
    icon: "🦴",
    title: "Orthopedics",
    description:
      "Specialized bone and joint care for improved mobility and pain relief.",
    color: "bg-yellow-100",
  },
  {
    icon: "👶",
    title: "Pediatrics",
    description:
      "Compassionate healthcare for infants, children, and adolescents.",
    color: "bg-green-100",
  },
  {
    icon: "🔬",
    title: "Dermatology",
    description:
      "Advanced skin care treatments for all your dermatological needs.",
    color: "bg-pink-100",
  },
  {
    icon: "👁️",
    title: "Ophthalmology",
    description:
      "Complete eye care services from routine exams to complex surgeries.",
    color: "bg-blue-100",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Medical Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive healthcare services tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div
                className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center text-2xl mb-4`}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
