"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

// Floating Particle Component
function FloatingParticle({
  delay = 0,
  size = 4,
  duration = 3,
  startX = 0,
  startY = 0,
}) {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: `${startX}%`,
        y: `${startY}%`,
        scale: 0,
      }}
      animate={{
        opacity: [0, 1, 0.5, 0],
        x: [`${startX}%`, `${randomX}%`, `${startX}%`],
        y: [`${startY}%`, `${randomY}%`, `${startY}%`],
        scale: [0, 1, 0.5, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
      className="absolute rounded-full bg-white/20"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}

// Animated Circle Component
function AnimatedCircle({
  delay = 0,
  size = 200,
  duration = 20,
  color = "primary",
}) {
  const colors = {
    primary: "border-primary-300/20",
    blue: "border-blue-400/15",
    white: "border-white/10",
  };

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
      animate={{
        rotate: 360,
        scale: [0.8, 1.2, 0.8],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        rotate: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        },
        scale: {
          duration: duration * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
          duration: duration * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`absolute rounded-full border-2 ${colors[color]}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `calc(50% - ${size / 2}px)`,
        top: `calc(50% - ${size / 2}px)`,
      }}
    />
  );
}

// Animated Grid Pattern
function AnimatedGrid() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.05, 0.1, 0.05] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: "50px 50px",
      }}
    />
  );
}

// Animated Wave Component
function AnimatedWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, -100, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-[200%] h-24"
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          <motion.path
            animate={{
              d: [
                "M0,60 C300,120 600,0 900,60 C1050,90 1150,60 1200,60 L1200,120 L0,120 Z",
                "M0,30 C300,90 600,120 900,30 C1050,0 1150,60 1200,30 L1200,120 L0,120 Z",
                "M0,60 C300,120 600,0 900,60 C1050,90 1150,60 1200,60 L1200,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            fill="rgba(255, 255, 255, 0.05)"
          />
        </svg>
      </motion.div>
    </div>
  );
}

// Animated Plus Signs (Medical Theme)
function MedicalPlus({ delay = 0, size = 20, x = 0, y = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.3, 0],
        scale: [0, 1, 0],
        rotate: [0, 90, 180],
        x: [x, x + 20, x],
        y: [y, y - 20, y],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/20 transform -translate-y-1/2" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 transform -translate-x-1/2" />
      </div>
    </motion.div>
  );
}

// Hexagon Pattern
function AnimatedHexagons() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.03, 0.06, 0.03] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute inset-0"
      style={{
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 20v30L30 55 5 50V20L30 5z' stroke='rgba(255,255,255,0.1)' fill='none' stroke-width='1'/%3E%3C/svg%3E")
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// Main Hero Component
export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [medicalPluses, setMedicalPluses] = useState([]);

  // Generate particles on component mount
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 5 + 3,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
    }));
    setParticles(newParticles);

    const newPluses = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: Math.random() * 4,
      size: Math.random() * 15 + 10,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setMedicalPluses(newPluses);
  }, []);

  // Mouse parallax effect
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;
    setMousePosition({ x: moveX, y: moveY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const scrollToAppointment = () => {
    const element = document.getElementById("appointment");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Staggered children animation for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden min-h-screen"
    >
      {/* ============= BACKGROUND ANIMATIONS LAYER ============= */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <AnimatedGrid />

        {/* Hexagon Medical Pattern */}
        <AnimatedHexagons />

        {/* Animated Concentric Circles */}
        <AnimatedCircle delay={0} size={400} duration={25} color="primary" />
        <AnimatedCircle delay={2} size={600} duration={30} color="blue" />
        <AnimatedCircle delay={4} size={800} duration={35} color="white" />
        <AnimatedCircle delay={1} size={300} duration={20} color="primary" />
        <AnimatedCircle delay={3} size={500} duration={28} color="blue" />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            delay={particle.delay}
            size={particle.size}
            duration={particle.duration}
            startX={particle.startX}
            startY={particle.startY}
          />
        ))}

        {/* Medical Plus Signs */}
        {medicalPluses.map((plus) => (
          <MedicalPlus
            key={plus.id}
            delay={plus.delay}
            size={plus.size}
            x={plus.x}
            y={plus.y}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-400/10 to-blue-400/10 rounded-full blur-3xl"
        />

        {/* Animated Waves at Bottom */}
        <AnimatedWaves />
      </div>

      {/* ============= MAIN CONTENT ============= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-sm">Open 24/7 for Emergencies</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Your Health,{" "}
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-300%"
                style={{ backgroundSize: "200% 100%" }}
              >
                Our Priority
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed"
            >
              Experience world-class healthcare with our team of expert medical
              professionals. Book your appointment today and take the first step
              towards better health.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255, 255, 255, 0.4)",
                    "0 0 0 20px rgba(255, 255, 255, 0)",
                    "0 0 0 0 rgba(255, 255, 255, 0)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                  },
                }}
                onClick={scrollToAppointment}
                className="relative bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg group overflow-hidden"
              >
                <motion.span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Book Appointment
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById("services");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-2 border-white/50 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
              >
                Our Services
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap items-center gap-8"
            >
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-300 to-blue-400 flex items-center justify-center text-xs font-bold shadow-lg"
                    >
                      {String.fromCharCode(64 + i)}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <p className="text-3xl font-bold">5000+</p>
                  <p className="text-sm text-blue-200">Happy Patients</p>
                </motion.div>
                <div className="w-px h-12 bg-white/20" />
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <p className="text-3xl font-bold">15+</p>
                  <p className="text-sm text-blue-200">Years Experience</p>
                </motion.div>
                <div className="w-px h-12 bg-white/20" />
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-sm text-blue-200">Specialists</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block"
            style={{
              x: -mousePosition.x,
              y: -mousePosition.y,
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
                  alt="Medical team"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/50 to-transparent" />

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-900 font-semibold text-sm">
                      Available 24/7
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary-700">
                      4.9
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">200+ reviews</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-white/50 rounded-full mt-1"
          />
        </div>
      </motion.div>
    </section>
  );
}
