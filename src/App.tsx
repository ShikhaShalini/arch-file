import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Images from fetch
const HERO_IMAGE = "https://images.pexels.com/photos/13752348/pexels-photo-13752348.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920";
const SERVICE_1 = "https://images.pexels.com/photos/27626185/pexels-photo-27626185.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";
const SERVICE_2 = "https://images.pexels.com/photos/31737860/pexels-photo-31737860.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";
const SERVICE_3 = "https://images.pexels.com/photos/31737861/pexels-photo-31737861.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";
const SERVICE_4 = "https://images.pexels.com/photos/6301175/pexels-photo-6301175.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";

const FEATURED_1 = "https://images.pexels.com/photos/7031408/pexels-photo-7031408.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200";
const FEATURED_2 = "https://images.pexels.com/photos/7031604/pexels-photo-7031604.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200";
const FEATURED_3 = "https://images.pexels.com/photos/13721095/pexels-photo-13721095.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200";

export default function App() {
  const [loader, setLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Magnetic cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 300 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 300 });

  useEffect(() => {
    // Loader simulation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoader(false), 600);
          return 100;
        }
        return p + Math.random() * 12;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loader) return;

    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Mouse move for cursor
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };
    window.addEventListener("mousemove", handleMouse);

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Navbar blur on scroll
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        onUpdate: (self) => {
          if (navRef.current) {
            if (self.direction === 1 || self.progress > 0.02) {
              navRef.current.classList.add("nav-blur");
            } else {
              navRef.current.classList.remove("nav-blur");
            }
          }
        },
      });

      // Hero parallax
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 20,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Hero text reveal
      gsap.fromTo(
        ".hero-title span",
        { y: 120, opacity: 0, rotateX: -80 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.4,
          stagger: 0.06,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".hero-meta",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 }
      );

      // Services cards
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        const img = card.querySelector(".service-img");
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.08,
          }
        );
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.3 },
            {
              scale: 1,
              duration: 1.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
              },
            }
          );
        }
      });

      // House plan lines
      gsap.fromTo(
        ".plan-row",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".plan-table",
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".plan-visual",
        { clipPath: "inset(0 100% 0 0)", scale: 0.95 },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".plan-visual",
            start: "top 75%",
          },
        }
      );

      // Featured properties
      gsap.utils.toArray<HTMLElement>(".property-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });

      // Fade up elements
      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    }, appRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouse);
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [loader, mouseX, mouseY]);

  const services = [
    {
      num: "01",
      title: "PROPERTY SHOWCASE",
      desc: "Elegant, high-impact visuals that elevate each property's unique essence.",
      img: SERVICE_1,
    },
    {
      num: "02",
      title: "SITE PLANNING",
      desc: "Smart, refined layouts that seamlessly harmonize with the natural landscape.",
      img: SERVICE_2,
    },
    {
      num: "03",
      title: "BUILDING DESIGN",
      desc: "Timeless architecture blending form, function, and sophistication.",
      img: SERVICE_3,
    },
    {
      num: "04",
      title: "SPACE PLANNING",
      desc: "Purposeful interiors designed for flow, balance, and quiet luxury.",
      img: SERVICE_4,
    },
  ];

  const properties = [
    {
      name: "Villa Nocturne",
      location: "Whistler, Canada",
      price: "$4.2M",
      img: FEATURED_1,
      specs: "5 BD • 6 BA • 4,800 sqft",
    },
    {
      name: "Glasshaven",
      location: "Quebec, Canada",
      price: "$3.8M",
      img: HERO_IMAGE,
      specs: "4 BD • 5 BA • 4,200 sqft",
    },
    {
      name: "Alpine Ridge",
      location: "Aspen, USA",
      price: "$5.1M",
      img: FEATURED_2,
      specs: "6 BD • 7 BA • 5,400 sqft",
    },
  ];

  const planData = [
    { room: "Living Room", area: "21 m²" },
    { room: "Dining Room", area: "9.3 m²" },
    { room: "Studio - Kitchen", area: "9.6 m²" },
    { room: "TV Lounge", area: "9 m²" },
    { room: "Master bedroom", area: "15.6 m²" },
    { room: "Guest bedroom", area: "11 m²" },
    { room: "Bathroom", area: "8.9 m²" },
    { room: "Hallways & wardrobe", area: "7.4 m²" },
  ];

  const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { damping: 15, stiffness: 150 });
    const springY = useSpring(y, { damping: 15, stiffness: 150 });

    const handleMove = (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.button
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: springX, y: springY }}
        className={`relative ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div
      ref={appRef}
      className="bg-[#0B0F14] text-[#E5E7EB] overflow-x-hidden"
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        html, body { overscroll-behavior: none; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        .nav-blur {
          background: rgba(11, 15, 20, 0.7) !important;
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 0.85;
        }
        .text-balance { text-wrap: balance; }
        .glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          backdrop-filter: blur(16px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .glass-strong {
          background: rgba(17,24,39,0.8);
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.1) 50%, transparent 80%);
          transform: translateX(-100%);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Custom cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{ x: cursorX, y: cursorY, background: "white" }}
      />

      {/* Loader */}
      <AnimatePresence>
        {loader && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#0B0F14] flex items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          >
            <div className="w-[min(90vw,720px)]">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-2">Glasshaven</p>
                  <h2 className="hero-title text-[clamp(40px,8vw,96px)] text-white">Loading</h2>
                </div>
                <div className="text-right">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">Progress</p>
                  <p className="text-3xl font-light tabular-nums">{Math.floor(progress)}%</p>
                </div>
              </div>
              <div className="h-[2px] w-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="mt-8 flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-[3px] flex-1 bg-white/20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-40 transition-all duration-500">
        <div className="mx-auto max-w-[1800px] px-6 md:px-10 h-[84px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full border border-white/20 grid place-items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/80">
                <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-[12px] tracking-widest uppercase text-white/70">@enor.designs</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["HOME", "ABOUT", "PROPERTIES", "SERVICES", "GALLERY", "CONTACTS"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden size-9 grid place-items-center rounded-full border border-white/15">
            <div className="space-y-1.5">
              <div className="w-4 h-[1.5px] bg-white/80" />
              <div className="w-4 h-[1.5px] bg-white/80" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-[#0B0F14]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="pt-[120px] px-8">
              {["HOME", "ABOUT", "PROPERTIES", "SERVICES", "GALLERY", "CONTACTS"].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="block py-4 text-3xl font-light tracking-wide border-b border-white/5"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[700px] overflow-hidden">
        <div ref={heroImgRef} className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Glasshaven" className="w-full h-[120%] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/40 via-[#0B0F14]/20 to-[#0B0F14]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,15,20,0.8)_100%)]" />
        </div>

        <div className="relative z-10 h-full max-w-[1800px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-[10vh]">
          {/* Large title */}
          <div className="hero-title text-[clamp(56px,13vw,220px)] text-white leading-none tracking-[-0.02em] overflow-hidden">
            {"GLASSHAVEN".split("").map((char, i) => (
              <span key={i} className="inline-block will-change-transform">
                {char}
              </span>
            ))}
          </div>

          <div className="hero-meta mt-8 md:mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[13px] md:text-[15px] tracking-[0.12em] uppercase text-white/80 font-medium">
                A NEW STANDARD
                <br />
                OF MODERN LIVING
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-1">Location</p>
              <p className="text-[13px] tracking-widest uppercase text-white/90">Quebec, Canada</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">Scroll</p>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Services */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="glass-strong rounded-[28px] md:rounded-[40px] p-8 md:p-14 lg:p-20">
            <div className="flex items-end justify-between mb-14 md:mb-20">
              <h2 className="hero-title text-[clamp(32px,5vw,64px)] text-white leading-none">OUR SERVICES</h2>
              <div className="hidden md:block">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/40">Est. 2018</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {services.map((s) => (
                <div key={s.num} className="service-card group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0B0F14]">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="service-img absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 shimmer" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-[28px] font-light tracking-wider text-white/90">{s.num}</span>
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>
                    <h3 className="text-[13px] tracking-[0.14em] uppercase font-medium text-white mb-2">{s.title}</h3>
                    <p className="text-[13px] leading-relaxed text-white/55 text-balance">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-3">Curated Selection</p>
              <h2 className="hero-title text-[clamp(28px,4vw,52px)] text-white leading-none">Featured Properties</h2>
            </div>
            <MagneticButton className="hidden md:inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-white/70 hover:text-white transition-colors group">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </MagneticButton>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {properties.map((p) => (
              <div key={p.name} className="property-card group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#111827]">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="glass px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-white/90">{p.price}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-[22px] font-medium text-white mb-1">{p.name}</h3>
                    <p className="text-[12px] text-white/70">{p.location} • {p.specs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* House Plan */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="glass-strong rounded-[28px] md:rounded-[40px] p-8 md:p-14 lg:p-20">
            <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-12 lg:gap-20 items-start">
              <div>
                <h2 className="hero-title text-[clamp(32px,5vw,64px)] text-white leading-none mb-6">HOUSE PLAN</h2>
                <p className="text-[13px] tracking-[0.14em] uppercase text-white/60 mb-10">THE AREA IS 92 M²</p>

                <div className="plan-table space-y-0 border-t border-white/10">
                  {planData.map((item) => (
                    <div key={item.room} className="plan-row flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-[14px] text-white/80">{item.room}</span>
                      <span className="text-[13px] font-medium tracking-wide text-white/60 tabular-nums">{item.area}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex flex-wrap gap-3">
                  {["3D Tour", "Floor Plans", "Spec Sheet"].map((label) => (
                    <MagneticButton key={label} className="group">
                      <span className="inline-flex items-center gap-2 px-5 h-11 rounded-full glass hover:bg-white/10 transition-colors text-[12px] tracking-widest uppercase">
                        {label}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                          <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </MagneticButton>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="plan-visual relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-[24px] bg-[#0B0F14] ring-1 ring-white/10">
                  <img src="/images/floorplan.png" alt="House Plan" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 mix-blend-overlay opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")` }} />
                </div>
                <div className="absolute -bottom-6 -right-6 hidden lg:block">
                  <div className="glass-strong rounded-2xl px-5 py-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">Architect</p>
                    <p className="text-[13px] text-white/90 mt-1">@glasshaven</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Manifesto */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-[1100px]">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-8 fade-up">Our Philosophy</p>
            <h3 className="text-[clamp(28px,4.5vw,56px)] leading-[1.1] font-light tracking-[-0.01em] text-balance fade-up">
              We design <span className="text-white">quiet luxury</span> homes where glass, light, and landscape converge. Every line is intentional—crafted for living, not just looking.
            </h3>
            <div className="mt-14 grid sm:grid-cols-3 gap-10">
              {[
                { k: "12+", v: "Years crafting modernist residences" },
                { k: "47", v: "Homes delivered across North America" },
                { k: "100%", v: "Custom architectural detailing" },
              ].map((item) => (
                <div key={item.k} className="fade-up">
                  <div className="text-[44px] font-light text-white/90 leading-none">{item.k}</div>
                  <p className="mt-3 text-[13px] text-white/55 max-w-[22ch]">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px]">
            <div className="absolute inset-0">
              <img src={FEATURED_3} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-[2px]" />
            </div>
            <div className="relative z-10 px-8 md:px-16 py-20 md:py-28">
              <div className="max-w-[900px]">
                <div className="flex items-center gap-2 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-[clamp(22px,3vw,36px)] leading-[1.3] font-light text-white/90 text-balance">
                  "Glasshaven transformed our vision into a living sculpture. The attention to materiality, light, and proportion is simply extraordinary."
                </blockquote>
                <div className="mt-10 flex items-center gap-4">
                  <div className="size-11 rounded-full bg-white/10 grid place-items-center text-[12px] font-medium">AL</div>
                  <div>
                    <p className="text-[14px] text-white">Amelia Laurent</p>
                    <p className="text-[12px] text-white/50">Villa Nocturne, Whistler</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <footer className="pt-24 pb-12 border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
            <div>
              <h4 className="hero-title text-[clamp(40px,7vw,110px)] text-white leading-[0.85]">LET'S BUILD YOUR HAVEN</h4>
              <p className="mt-8 text-[15px] leading-relaxed text-white/60 max-w-[55ch]">Private commissions for discerning clients. Architecture, interiors, and landscape—delivered as one seamless vision.</p>
            </div>
            <div className="lg:justify-self-end w-full max-w-[420px]">
              <div className="glass rounded-[20px] p-[1px]">
                <div className="rounded-[19px] bg-[#0B0F14]/80 p-6">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-4">Inquire</p>
                  <div className="space-y-3">
                    <input placeholder="Your name" className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 outline-none text-[14px] placeholder:text-white/30 focus:border-white/20 transition-colors" />
                    <input placeholder="Email address" className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 outline-none text-[14px] placeholder:text-white/30 focus:border-white/20 transition-colors" />
                    <textarea placeholder="Tell us about your site..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 outline-none text-[14px] placeholder:text-white/30 focus:border-white/20 transition-colors resize-none" />
                    <MagneticButton className="w-full">
                      <span className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-white text-black text-[12px] tracking-widest uppercase font-medium hover:bg-white/90 transition-colors">
                        Request Consultation
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="hero-title text-[22px] text-white leading-none">GLASSHAVEN</span>
              <span className="text-[12px] text-white/40">© 2025 Glasshaven Architecture Studio</span>
            </div>
            <div className="flex items-center gap-6 text-[12px] text-white/50">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Pinterest</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}