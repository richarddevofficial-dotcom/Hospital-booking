"use client";

import { motion } from "framer-motion";

const doctors = [
  {
    name: "Dr. John Smith",
    specialty: "Cardiologist",
    experience: "15+ Years",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
  },
  {
    name: "Dr. Sarah Johnson",
    specialty: "Neurologist",
    experience: "12+ Years",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
  },
  {
    name: "Dr. Michael Brown",
    specialty: "Orthopedic Surgeon",
    experience: "20+ Years",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop",
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Pediatrician",
    experience: "10+ Years",
    image:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop",
  },
];

export default function Doctors() {
  return (
    <section id="doctors" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet Our Doctors
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experienced medical professionals dedicated to your health
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="relative h-64 bg-gray-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-primary-600 font-medium">
                  {doctor.specialty}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {doctor.experience} of experience
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
