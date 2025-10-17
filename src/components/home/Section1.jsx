"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default function Section1() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.4 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Advanced scroll-based transforms
  const imageY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const textX = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Spring physics for smoothness
  const springY = useSpring(imageY, { stiffness: 100, damping: 30 });
  const springX = useSpring(textX, { stiffness: 100, damping: 30 });

  // Text animation states
  const [displayText, setDisplayText] = useState("");
  const fullText = "Define  Your";

  // Particle system for image
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isInView) {
      // Typewriter effect
      let i = 0;
      const typeInterval = setInterval(() => {
        setDisplayText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(typeInterval);
      }, 80);

      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      }));
      setParticles(newParticles);

      return () => clearInterval(typeInterval);
    }
  }, [isInView]);

  // Magnetic button effect
  const MagneticButton = ({ children, className }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = (clientX - left - width / 2) * 0.3;
      const y = (clientY - top - height / 2) * 0.3;
      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      animate(position.x, 0, { duration: 0.5 });
      animate(position.y, 0, { duration: 0.5 });
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.div
        style={{ x: position.x, y: position.y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  // Advanced text reveal animation
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: 90,
      filter: "blur(10px)",
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.04,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
        opacity: { duration: 0.3 },
        filter: { duration: 0.4 },
      },
    }),
  };

  // Image hover animation
  const imageVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 10,
        },
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-100 to-amber-50 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-rose-50 to-yellow-50 rounded-full blur-3xl opacity-30"
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0,
            scale: 0,
            x: `${particle.x}%`,
            y: `${particle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: `${particle.x}%`,
            y: [`${particle.y}%`, `${particle.y - 20}%`],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 bg-[#ff7a45] rounded-full opacity-20"
        />
      ))}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr_1fr] items-center gap-12 md:gap-20">
        {/* LEFT — Advanced text animations */}
        <motion.div
          ref={textRef}
          style={{ x: springX, opacity }}
          className="space-y-8 text-left"
        >
          <h1 className="font-[900] tracking-tight leading-[1.05] text-5xl sm:text-6xl md:text-7xl text-neutral-900 min-h-[180px]">
            {displayText.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: displayText.length * 0.04 + 0.5 }}
              className="block"
            >
              <span className="] bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                Style Identity
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="max-w-[36ch] text-neutral-600 text-lg leading-relaxed font-light"
          >
            From sketch to stitch — create your look with pieces that combine
            comfort, confidence, and craftsmanship. Designed for every moment.
          </motion.p>

          <MagneticButton className="inline-flex items-center gap-3">
            <motion.button
              whileHover={{
                scale: 1.02,
                background: "linear-gradient(135deg, #ff7a45, #ff5722)",
              }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ff5722] text-white px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <ShoppingBag className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </MagneticButton>
        </motion.div>

        {/* CENTER — Advanced image animations */}
        <motion.div
          ref={imageRef}
          style={{ y: springY, opacity }}
          className="relative flex items-center justify-center"
        >
          {/* Animated gradient background */}
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 30% 50%, #f7e8dd, #f8f0e8)",
                "radial-gradient(circle at 70% 50%, #f8f0e8, #f7e8dd)",
                "radial-gradient(circle at 30% 50%, #f7e8dd, #f8f0e8)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -z-10 h-[480px] w-[380px] sm:h-[560px] sm:w-[440px] rounded-[42%] opacity-90"
          />

          {/* Glow effect */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -z-5 bg-gradient-to-r from-orange-200/30 to-amber-200/20 blur-xl rounded-full"
          />

          <motion.div
            variants={imageVariants}
            initial="initial"
            whileHover="hover"
            className="relative"
          >
            <motion.img
              src="/images/model-man.png"
              alt="Model wearing hoodie and tee"
              className="h-[480px] sm:h-[560px] w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] cursor-pointer"
              whileHover={{
                filter: "drop-shadow(0 35px 65px rgba(0,0,0,0.25))",
              }}
            />

            {/* Floating sparkles */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute top-10 right-10"
            >
              <Sparkles className="h-6 w-6 text-[#ff7a45]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT — Enhanced shop details */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{ opacity }}
          className="text-left md:text-left space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <h3 className="text-neutral-900 font-bold text-2xl mb-3 flex items-center gap-2">
              Shop Now
              <motion.div
                animate={{ rotate: [0, 15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-5 w-5 text-[#ff7a45]" />
              </motion.div>
            </h3>
            <p className="text-lg text-neutral-600 leading-relaxed mb-6 font-light">
              The best jackets, tees, and minimalist staples for daily wear —
              designed to make you look effortlessly sharp.
            </p>
          </motion.div>

          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#000",
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-neutral-900 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Stats counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200"
          >
            {[
              { value: "200+", label: "Styles" },
              { value: "98%", label: "Happy Clients" },
              { value: "2Y", label: "Warranty" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  className="text-2xl font-bold text-neutral-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 2.2 + index * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-neutral-500 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
