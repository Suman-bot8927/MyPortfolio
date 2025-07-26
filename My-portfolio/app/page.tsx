'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ExternalLink,
  Calendar,
  GraduationCap,
  Briefcase,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Physics-based floating particles component
const FloatingParticle = ({ delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && typeof window !== 'undefined') {
      ref.current.style.left = `${Math.random() * window.innerWidth}px`;
      ref.current.style.top = `${Math.random() * window.innerHeight}px`;
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className="absolute w-2 h-2 bg-[#A5C9CA]/40 rounded-full"
      initial={{ scale: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: 'linear',
      }}
    />
  );
};

// Magnetic cursor effect component
const MagneticElement = ({ children, strength = 0.3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current || typeof window === 'undefined') return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < 150) {
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, strength]);

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} className="relative">
      {children}
    </motion.div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current || typeof window === 'undefined') return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(e.clientX - centerX);
      y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div style={{ transform: 'translateZ(50px)' }}>{children}</motion.div>
    </motion.div>
  );
};

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const containerRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 1000]);
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  // Advanced mouse tracking with physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 500, damping: 100 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (typeof window !== 'undefined') {
        setMousePosition({ x: e.clientX, y: e.clientY });
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  // Use useTransform at the top level
  const transformX = useTransform(mouseXSpring, (val) =>
    typeof window !== 'undefined' ? (val / window.innerWidth - 0.5) * 100 : 0
  );
  const transformY = useTransform(mouseYSpring, (val) =>
    typeof window !== 'undefined' ? (val / window.innerHeight - 0.5) * 100 : 0
  );

  // Update orb style using the transforms
  const [orbStyle, setOrbStyle] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateOrbPosition = () => {
      setOrbStyle({
        x: transformX.get(),
        y: transformY.get(),
      });
    };
    updateOrbPosition(); // Initial call
    const interval = setInterval(updateOrbPosition, 16); // Approximately 60 FPS
    window.addEventListener('resize', updateOrbPosition);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateOrbPosition);
    };
  }, [transformX, transformY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.8,
      },
    },
  };

  const skills = [
    { name: 'Python', level: 90, icon: '🐍', color: '#A5C9CA' },
    { name: 'Machine Learning', level: 85, icon: '🤖', color: '#395B64' },
    { name: 'Java', level: 80, icon: '☕', color: '#E7F6F2' },
    { name: 'C Programming', level: 85, icon: '⚡', color: '#A5C9CA' },
    { name: 'AWS', level: 75, icon: '☁️', color: '#395B64' },
    { name: 'Data Science', level: 88, icon: '📊', color: '#E7F6F2' },
    { name: 'Frontend', level: 60, icon: '🌐', color: '#29f3baff' },
    { name: 'Web', level: 70, icon: '🌐', color: '#29f3baff' },
  ];

  const projects = [
    {
      title: 'Employee Attrition Prediction',
      description:
        'Developed a predictive model to identify potential employee attrition using supervised machine learning algorithms including Logistic Regression, Decision Tree, Random Forest, and Support Vector Machine.',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'Machine Learning'],
      link: 'https://souvikh007kv.pythonanywhere.com/',
    },
     {
      title: 'Admin Dashboard',
      description:
        'Developed a comprehensive admin dashboard for monitoring user activity and system performance using React and Node.js.',
      tech: ['React', 'Node.js', 'Express', 'MongoDB'],
      link: 'https://dashboard-mern-chi.vercel.app/',
    },
     {
      title: 'Advance to do list',
      description:
        'Developed an advanced to-do list application with features like task prioritization, deadlines, and user authentication using React and Node.js.',
      tech: ['React','react-chartjs-2'],
      link: 'https://advance-to-do-list-delta.vercel.app/',
    },
     {
      title: 'Anonymous Chat Application',
      description:
        'Developed a real-time anonymous chat application using WebSocket for instant messaging and Node.js for the backend.',
      tech: ['React', 'Node.js', 'WebSocket'],
      link: 'https://unknown-chat.vercel.app/',
    },

  ];

  const certifications = [
    {
      title: 'Data Visualization: Empowering Business with Effective Insights',
      date: 'April 17th, 2025',
    },
    {
      title: 'Data Analytics Job Simulation',
      date: 'April 19th, 2025',
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#2C3333] via-[#395B64] to-[#2C3333] text-white overflow-x-hidden"
      ref={containerRef}
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-[#A5C9CA]/50 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
        }}
        animate={{
          scale: cursorVariant === 'hover' ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A5C9CA] to-[#395B64] origin-left z-50"
        style={{ scaleX: pathLength }}
      />

      {/* Advanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orb */}
        <motion.div
          className="absolute w-96 h-96 bg-[#A5C9CA]/10 rounded-full blur-3xl"
          style={{
            x: orbStyle.x,
            y: orbStyle.y,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />

        {/* Physics Particles */}
        {[...Array(100)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.1} />
        ))}

        {/* Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 border border-[#A5C9CA]/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-[#395B64]/10 rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center relative px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center z-10">
          <motion.div variants={itemVariants} className="mb-8">
            <MagneticElement strength={0.2}>
              <motion.h1
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#A5C9CA] via-[#E7F6F2] to-[#A5C9CA] bg-clip-text text-transparent mb-4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                whileHover={{
                  scale: 1.05,
                  textShadow: '0 0 20px rgba(165, 201, 202, 0.5)',
                }}
                onHoverStart={() => setCursorVariant('hover')}
                onHoverEnd={() => setCursorVariant('default')}
              >
                SUMAN SAMANTA
              </motion.h1>
            </MagneticElement>

            <motion.div variants={itemVariants} className="flex items-center justify-center space-x-2 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              >
                <Sparkles className="h-6 w-6 text-[#A5C9CA]" />
              </motion.div>
              <motion.p className="text-xl md:text-2xl text-gray-300">
                Computer Science Student & ML Enthusiastb
              </motion.p>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              >
                <Zap className="h-6 w-6 text-[#395B64]" />
              </motion.div>
            </motion.div>

            <motion.p className="text-lg text-gray-400" variants={itemVariants}>
              Specializing in Data Science & AI Solutions
            </motion.p>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-4 mb-8" variants={itemVariants}>
            <MagneticElement>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-[#A5C9CA] text-[#A5C9CA] hover:bg-[#A5C9CA] hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#A5C9CA]/25"
                asChild
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <motion.a
                  href="mailto:sumansamanta1746@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Me
                </motion.a>
              </Button>
            </MagneticElement>

            <MagneticElement>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-[#395B64] text-[#395B64] hover:bg-[#395B64] hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#395B64]/25"
                asChild
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <motion.a
                  href="https://github.com/sumansamanta1746"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </motion.a>
              </Button>
            </MagneticElement>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2] bg-clip-text text-transparent"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            About Me
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <TiltCard>
                <Card className="bg-[#2C3333]/50 border-[#395B64] backdrop-blur-sm hover:shadow-2xl hover:shadow-[#A5C9CA]/10 transition-all duration-500">
                  <CardContent className="p-8">
                    <motion.p
                      className="text-gray-300 text-lg leading-relaxed mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Motivated Computer Science student with a solid grounding in Machine Learning, NLP and
                      web-application security. Proven track record in designing and deploying AI solutions leveraging
                      Python, SQL and JavaScript within agile, cloud-based environments.
                    </motion.p>
                    <motion.p
                      className="text-gray-300 text-lg leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Strong communicator and quick learner, ready to drive innovative software engineering projects
                      from concept to production.
                    </motion.p>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              {[
                { icon: MapPin, text: 'West Medinipur, West Bengal', color: '#A5C9CA' },
                { icon: Phone, text: '+91 8927579821', color: '#395B64' },
                { icon: Mail, text: 'sumansamanta1746@gmail.com', color: '#E7F6F2' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 text-gray-300"
                  whileHover={{ x: 10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}

              <motion.div
                className="flex items-center space-x-4 text-gray-300"
                whileHover={{ x: 10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Linkedin className="h-5 w-5 text-[#A5C9CA]" />
                <a
                  href="https://www.linkedin.com/in/sumansamanta-85a778327"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#A5C9CA] transition-colors"
                >
                  LinkedIn Profile
                </a>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4 text-gray-300"
                whileHover={{ x: 10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Github className="h-5 w-5 text-[#395B64]" />
                <a
                  href="https://github.com/sumansamanta1746"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#395B64] transition-colors"
                >
                  GitHub Profile
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Education Section */}
      <motion.section
        className="py-20 px-4 bg-[#2C3333]/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2] bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Education
          </motion.h2>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-[#2C3333]/50 border-[#395B64] backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <GraduationCap className="h-8 w-8 text-[#A5C9CA] mt-1" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        B.Tech in Computer Science and Engineering (Data Science)
                      </h3>
                      <p className="text-[#A5C9CA] text-lg mb-2">
                        Haldia Institute of Technology (HIT), Haldia, West Bengal
                      </p>
                      <div className="flex items-center space-x-4 text-gray-300">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          08/2022 - Present
                        </span>
                        <span className="bg-gradient-to-r from-green-400 to-cyan-400 px-3 py-1 rounded-full text-black font-semibold">
                          CGPA: 8.3/10 (5th semester)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-[#2C3333]/50 border-[#395B64] backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <GraduationCap className="h-8 w-8 text-[#395B64] mt-1" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">Higher Secondary Education</h3>
                      <p className="text-[#395B64] text-lg mb-2">
                        Daspur Vivekananda High School, West Medinipur, West Bengal
                      </p>
                      <div className="flex items-center space-x-4 text-gray-300">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          2020 - 2021
                        </span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 px-3 py-1 rounded-full text-black font-semibold">
                          Grade: 83%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2] bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Skills & Technologies
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                className="group"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <TiltCard className="h-full">
                  <Card className="bg-[#2C3333]/50 border-[#395B64] backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#A5C9CA]/20">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.2,
                        }}
                      >
                        {skill.icon}
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white mb-3">{skill.name}</h3>
                      <div className="w-full bg-[#2C3333] rounded-full h-2 mb-2 overflow-hidden">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${skill.color}, #395B64)`,
                          }}
                          initial={{ width: 0, x: '-100%' }}
                          whileInView={{
                            width: `${skill.level}%`,
                            x: 0,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.1,
                            type: 'spring',
                            stiffness: 100,
                          }}
                        />
                      </div>
                      <motion.span
                        className="text-sm text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {skill.level}%
                      </motion.span>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        className="py-20 px-4 bg-[#2C3333]/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2] bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Experience
          </motion.h2>

          <motion.div variants={itemVariants}>
            <Card className="bg-[#2C3333]/50 border-[#395B64] backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Briefcase className="h-8 w-8 text-[#A5C9CA] mt-1" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Machine Learning in Python & Cloud Computing Training
                    </h3>
                    <p className="text-[#A5C9CA] text-lg mb-2">In House Training Program</p>
                    <div className="flex items-center space-x-4 text-gray-300 mb-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Jan 25 - Mar 25
                      </span>
                    </div>
                    <div className="space-y-3 text-gray-300">
                      <p>
                        • Machine Learning: Hands-on with regression, classification, clustering and model tuning on
                        real-world datasets.
                      </p>
                      <p>
                        • Cloud Computing: Provisioned and managed AWS EC2, S3, Elastic Beanstalk, CloudFront and Lambda
                        for scalable, serverless architectures.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2] bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Projects
          </motion.h2>

          <div className="grid gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <TiltCard>
                  <Card className="bg-[#2C3333]/50 border-[#395B64] backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#A5C9CA]/20">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <motion.h3
                          className="text-2xl font-bold text-white group-hover:text-[#A5C9CA] transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          {project.title}
                        </motion.h3>
                        <MagneticElement>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-[#A5C9CA] hover:bg-[#A5C9CA]/10"
                            asChild
                          >
                            <motion.a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ rotate: 15, scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </motion.a>
                          </Button>
                        </MagneticElement>
                      </div>
                      <motion.p
                        className="text-gray-300 text-lg mb-6 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {project.description}
                      </motion.p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="px-3 py-1 bg-gradient-to-r from-[#A5C9CA]/20 to-[#395B64]/20 border border-[#A5C9CA]/30 rounded-full text-sm text-[#A5C9CA]"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: techIndex * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2] bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Let's Connect
          </motion.h2>

          <motion.p className="text-xl text-gray-300 mb-12" variants={itemVariants}>
            Ready to collaborate on innovative AI and ML projects? Let's build something amazing together!
          </motion.p>

          <motion.div className="flex flex-wrap justify-center gap-6" variants={itemVariants}>
            <MagneticElement strength={0.4}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#A5C9CA] to-[#395B64] hover:from-[#E7F6F2] hover:to-[#A5C9CA] text-[#2C3333] font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#A5C9CA]/30"
                asChild
              >
                <motion.a
                  href="mailto:sumansamanta1746@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(165, 201, 202, 0.3)',
                      '0 0 40px rgba(165, 201, 202, 0.5)',
                      '0 0 20px rgba(165, 201, 202, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </motion.a>
              </Button>
            </MagneticElement>

            <MagneticElement strength={0.4}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#395B64] text-[#395B64] hover:bg-[#395B64] hover:text-black px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent hover:shadow-xl hover:shadow-[#395B64]/30"
                asChild
              >
                <motion.a
                  href="https://github.com/sumansamanta1746"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="mr-2 h-5 w-5" />
                  View GitHub
                </motion.a>
              </Button>
            </MagneticElement>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="py-8 px-4 border-t border-[#395B64]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            className="text-gray-400"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            © 2025 Suman Samanta. Crafted with ❤️ using React, Framer Motion & Tailwind CSS
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}