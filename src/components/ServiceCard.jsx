
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// ─── BackgroundGradient (inlined — remove if you already have it globally) ───
const BackgroundGradient = ({ children, className, containerClassName, animate = true }) => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
  };
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      {/* blurred glow layer */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: "reverse" } : undefined}
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      {/* solid border layer */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: "reverse" } : undefined}
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

// ─── Service data ─────────────────────────────────────────────────────────────
// Swap image paths to your actual assets
const services = [
  {
    image: "app.jpeg",
    title: "University Application",
    desc: "We identify the best French universities matching your profile, prepare your dossier, and handle the entire Campus France application process on your behalf.",
    featured: false,
  },
  {
    image: "study.png",
    title: "Document Preparation",
    desc: "Preparation of your CV according to French standards. - Writing of a professional Letter of Motivation.   - Translation of documents into French (translation fees are extra and depend on the number and language of documents).",
    featured: false,
  },
  {
    image: "documentation.png",
    title: "Admission Process",
    desc: "We apply to French universities on your behalf. We secure your admission and provide the official Admission Letter and all related",
    featured: true,
  },
  {
    image: "assist.png",
    title: "Interview Preparation",
    desc: "Guidance and preparation for the Campus France and visa interview.",
    featured: false,
  },
  {
    image: "visa.png",
    title: "Visa Assistance",
    desc: "Being based in France, we know exactly what the French consulate expects. We prepare your visa file meticulously, achieving a 98% success rate for our students.",
    featured: false,
  },
  
  {
    image: "accomodation.png",
    title: "Accommodation Assistance",
    desc: "We help you apply for CROUS university residences, private student apartments, and homestays, ensuring you have a safe and affordable place to live from day one.",
    featured: false,
  },
  
];

// ─── Individual card ──────────────────────────────────────────────────────────
function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <BackgroundGradient
        containerClassName="h-full"
        className={cn(
          "h-full rounded-[22px] overflow-hidden flex flex-col",
          service.featured ? "bg-white" : "bg-white"
          // both white — featured is distinguished only by the gradient border
        )}
      >
        {/* Card image */}
        <div className="w-full h-44 overflow-hidden shrink-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 px-6 py-5">
          {/* Featured pill */}
          {service.featured && (
            <span className="self-start mb-3 text-[10px] font-bold uppercase tracking-[1px] bg-[#eef1fc] text-[#002395] px-3 py-1 rounded-full border border-[rgba(0,35,149,0.15)]">
              Most Popular
            </span>
          )}

          <h3 className="font-bold text-[17px] mb-2.5 leading-snug text-[#00185a] font-[Playfair_Display,Georgia,serif]">
            {service.title}
          </h3>

          <p className="text-[13.5px] leading-[1.7] text-[#6b7280] flex-1">
            {service.desc}
          </p>

          <div className="mt-5 text-[13px] font-semibold flex items-center gap-1.5 text-[#002395] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
            Learn more <span>→</span>
          </div>
        </div>
      </BackgroundGradient>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#faf8f4] py-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#f5e9c8] text-[#c9a84c] text-[11px] font-bold tracking-[1.2px] uppercase px-4 py-1.5 rounded-full border border-[rgba(201,168,76,0.3)] mb-3">
            What We Do
          </span>
          <h2 className="font-[Playfair_Display,Georgia,serif] font-bold text-[#00185a] leading-[1.2] mb-3 text-[clamp(26px,3.5vw,40px)]">
            Complete Support,{" "}
            <em className="italic text-[#002395]">Every Step</em>{" "}
            of the Way
          </h2>
          <p className="text-[15px] text-[#6b7280] leading-[1.75] max-w-[540px] mx-auto">
            From your first inquiry to the day you arrive in France, AZ Consultations provides end-to-end guidance tailored to your academic goals.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}