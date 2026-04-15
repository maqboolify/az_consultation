import { useState, useEffect, useRef } from "react";

// ─── Keyframe animations injected via <style> ───────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    @keyframes phone-outer {
      0%, 100% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
      33.3333% { transform: translate3d(0,0,0) scale(1.1); box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5); }
      66.6666% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
    }
    @keyframes phone-inner {
      0% { opacity:1; transform:translate3d(0,0,0) scale(0); }
      33.3333% { opacity:1; transform:translate3d(0,0,0) scale(.9); }
      66.6666%, 100% { opacity:0; transform:translate3d(0,0,0) scale(0); }
    }
    @keyframes phone-icon {
      0%,46% { transform:translate3d(0,0,0); }
      2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform:translate3d(.01em,0,0); }
      4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform:translate3d(-.01em,0,0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(1.8); opacity: 0; }
    }

    .is-animating { animation: 3s infinite phone-outer; }
    .is-animating::before { animation: 3s infinite phone-inner; }
    .is-animating::after { animation: 3s infinite phone-icon; }

    .fade-in-up { animation: fadeInUp 0.6s ease both; }
    .slide-in-left { animation: slideInLeft 0.5s ease both; }

    .scholarship-row:hover { background-color: #f0f7ff !important; }
    .scholarship-row:hover td { color: #0064b0 !important; }

    .list-item-hover:hover { transform: translateX(4px); }
    .list-item-hover { transition: transform 0.2s ease; }

    .check-icon { fill: #0064b0; }
    .overlay-img { transition: transform 0.5s ease; }
    .overlay-wrap:hover .overlay-img { transform: scale(1.06); }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background-color: #ebebeb; border-radius: 10px; }
    ::-webkit-scrollbar-thumb { border-radius: 10px; background: #193393; }

    .cta-phone-btn::before, .cta-phone-btn::after {
      position: absolute; content: "";
    }
    .cta-phone-btn::after {
      top: .25em; left: .25em; width: .5em; height: .5em;
      background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50% / cover no-repeat;
      transform: translate3d(0,0,0);
    }
    .section-bg-light { background-color: #f8faff; }
    .section-bg-white { background-color: #ffffff; }
    .section-bg-blue { background: linear-gradient(135deg, #0064b0 0%, #193393 100%); }
  `}</style>
);

// ─── Check Circle SVG ────────────────────────────────────────────────────────
const CheckCircle = ({ className = "w-5 h-5 flex-shrink-0" }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ fill: "#0064b0" }}>
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
  </svg>
);

// ─── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const duration = 2000;
          const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} style={{ animation: "countUp 0.4s ease both" }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// ─── MBA Table Data ──────────────────────────────────────────────────────────
const mbaData = [
  { name: "Hassan Malik", university: "Successfully admitted to ESSEC Business School, France", amount: "", year: "(2023-24)" },
  { name: "Fatima Zahra Siddiqui", university: "Successfully admitted to HEC Paris and ESCP Europe", amount: "8K €", year: "(2023-24)" },
  { name: "Zainab Mirza", university: "Successfully admitted to Sciences Po Paris, Sorbonne University", amount: "", year: "(2023-24)" },
  { name: "Ahmed Raza Khan", university: "Successfully admitted to Grenoble École de Management, KEDGE", amount: "", year: "(2023-24)" },
  { name: "Sana Qureshi", university: "Successfully admitted to EM Lyon, emlyon business school", amount: "", year: "(2023-24)" },
  { name: "Bilal Chaudhry", university: "Scholarship", amount: "3000 € from University of Strasbourg, France", year: "(2022-23)" },
  { name: "Ayesha Nawaz", university: "Scholarship from Université Paris-Saclay and 2,500 € from Université de Montpellier, France", amount: "2,500 €", year: "(2022-23)" },
  { name: "Usman Tariq", university: "Scholarship", amount: "5,000 € from Université de Lyon, 4,000 € from Université de Bordeaux, France", year: "(2021-22)" },
  { name: "Mariam Farooq", university: "Excellence Scholarship from Université de Paris", amount: "6,000 €", year: "(2021-22)" },
  { name: "Saad Hussain", university: "Scholarship from Sciences Po Paris", amount: "4,500 €", year: "(2020-21)" },
  { name: "Nadia Akhtar", university: "Scholarship from Université Sorbonne Nouvelle", amount: "3,200 € per year", year: "(2020-21)" },
  { name: "Imran Sheikh", university: "Scholarship from Université de Toulouse", amount: "2,800 €", year: "(2020-21)" },
  { name: "Hira Baig", university: "Scholarship from Université de Strasbourg", amount: "2,500 €", year: "(2020-21)" },
];

// ─── Masters Students Data ───────────────────────────────────────────────────
const mastersData = [
  { text: <><strong>Ali Hassan Rizvi</strong> – Scholarship of <strong>4,500 €</strong> from <strong>Université Paris 1 Panthéon-Sorbonne, France</strong> (2023-24)</> },
  { text: <><strong>Amna Khalid</strong> – Scholarship of <strong>3,800 €</strong> from <strong>Université de Lille, France</strong> (2023-24)</> },
  { text: <><strong>Zara Butt</strong> – Scholarship of <strong>2,900 €</strong> from <strong>Université de Bordeaux, France</strong> (2023-24)</> },
  { text: <><strong>Hamza Ijaz</strong> – Scholarship of <strong>2,000 €</strong> from <strong>Université de Strasbourg, France</strong> (2023-24)</> },
  { text: <><strong>Maryam Shafiq</strong> – Successfully admitted to <strong>Sciences Po Paris, Institut Marangoni – Paris</strong> (2023-24)</> },
  { text: <><strong>Tariq Mehmood</strong> – Successfully admitted to <strong>Université Paris-Saclay</strong> (2023-24)</> },
  { text: <><strong>Sobia Anwar</strong> – Successfully admitted to <strong>Université de Lyon</strong> (2023-24)</> },
  { text: <><strong>Kamran Iqbal</strong> – Successfully admitted to <strong>Grenoble INP, France</strong> (2023-24)</> },
  { text: <><strong>Iqra Yousaf</strong> – Successfully admitted to <strong>Université Paris-Est Créteil, ISEP Paris, SKEMA Business School, Excelia Business School</strong> (2023-24)</> },
  { text: <><strong>Naila Bashir</strong> – Successfully admitted to <strong>Université de Nantes</strong> (2023-24)</> },
  { text: <><strong>Shahzad Mirza</strong> – Successfully admitted to <strong>Université de Rennes, Université de Poitiers, Université de Tours, Université d'Orléans</strong> (2023-24)</> },
  { text: <><strong>Faisal Rehman</strong> – Successfully admitted to <strong>Institut Marangoni – Paris, ISD Paris, ECV Paris</strong> (2023-24)</> },
  { text: <><strong>Asma Javed</strong> – Successfully admitted to <strong>Université Paris Cité, Université Paris 8, Université Paris-Nanterre</strong> (2023-24)</> },
  { text: <><strong>Rabia Saleem</strong> – Successfully admitted to <strong>ESCP Europe, EM Normandie, INSEEC Business School, Excelia, Kedge</strong> (2023-24)</> },
  { text: <><strong>Junaid Malik</strong> – Successfully admitted to <strong>Université de Montpellier, ISEM Montpellier</strong> (2023-24)</> },
  { text: <><strong>Lubna Pervez</strong> – Successfully admitted to <strong>Institut Marangoni Paris, Mod'Art International</strong> (2023-24)</> },
  { text: <><strong>Waqas Niazi</strong> – Successfully admitted to <strong>Université Paris-Saclay, Université de Versailles</strong> (2023-24)</> },
  { text: <><strong>Mehwish Tauseef</strong> – Successfully admitted to <strong>Université Gustave Eiffel, Université Paris-Est Créteil</strong> (2023-24)</> },
  { text: <><strong>Danish Haider</strong> – Scholarship of <strong>3,000 €</strong> from <strong>Université de Nantes, France</strong> (2022-23)</> },
  { text: <><strong>Sadaf Waheed</strong> – Scholarship of <strong>2,500 €</strong> from <strong>Sciences Po Bordeaux</strong> (2022-23)</> },
  { text: <><strong>Omer Farooq</strong> – <strong>Excellence</strong> scholarship from <strong>Université de Strasbourg</strong> (2022-23)</> },
  { text: <><strong>Kiran Riaz</strong> – <strong>Merit</strong> scholarship from <strong>Université Paris 1 Panthéon-Sorbonne</strong> (2021-22)</> },
  { text: <><strong>Adeel Chaudhry</strong> – <strong>4,000 €</strong> scholarship from <strong>Grenoble École de Management</strong> (2021-22)</> },
  { text: <><strong>Huma Shabbir</strong> – Scholarship of <strong>3,500 €</strong> per year from <strong>KEDGE Business School</strong> (2021-22)</> },
];

// ─── UG Non-Design Data ──────────────────────────────────────────────────────
const ugNonDesignData = [
  { text: <><strong>Mahnoor Sajid</strong> – Scholarship of <strong>3,200 €</strong> from <strong>Université de Lille, France</strong> (2023-2024)</> },
  { text: <><strong>Usman Ghani</strong> – Scholarship of <strong>4,800 €</strong> International Excellence Scholarship from <strong>Université Paris-Saclay, France</strong> (2023-2024)</> },
  { text: <><strong>Sana Riaz</strong> – Scholarship of <strong>2,600 €</strong> from <strong>Université de Bordeaux, France</strong> (2023-2024)</> },
  { text: <><strong>Farrukh Noor</strong> – <strong>Full scholarship</strong> from Université de Strasbourg (2022-23)</> },
  { text: <><strong>Laiba Tariq</strong> – <strong>Excellence</strong> Award Scholarship from <strong>Sciences Po Lyon</strong> (2022-23)</> },
  { text: <><strong>Bilal Yousuf</strong> – <strong>Merit Scholarship</strong> from <strong>Université de Montpellier</strong>, including tuition fee support (2022-23)</> },
  { text: <><strong>Rida Fatima</strong> – Scholarship of <strong>5,000 €</strong> from <strong>Université de Paris</strong>, <strong>3,500 € Excellence Award</strong> from <strong>Université de Lyon</strong>, and scholarship of <strong>2,200 €</strong> from <strong>Université de Toulouse</strong> (2021-22)</> },
  { text: <><strong>Zubair Hussain</strong> – 70% scholarship in Engineering from Université de Grenoble (2021-22)</> },
  { text: <><strong>Ifra Shahzad</strong> – Above 50% scholarship from Université d'Orléans, France (2021-22)</> },
  { text: <><strong>Naeem Baig</strong> – <strong>50% Merit Scholarship</strong> on tuition fee from <strong>INSA Lyon</strong> (2021-22)</> },
  { text: <><strong>Arooj Malik</strong> – <strong>4,000 €</strong> scholarship from EM Normandie, <strong>2,500 €</strong> from Sciences Po Bordeaux, <strong>2,000 €</strong> from Université de Pau (2021-22)</> },
  { text: <><strong>Hassan Nawaz</strong> – Scholarship of <strong>3,800 €</strong> from <strong>Université Paris-Nanterre</strong> (2021-22)</> },
  { text: <><strong>Ayesha Butt</strong> – <strong>3,600 €</strong> Merit Scholarship from Université de Nantes (2021-22)</> },
  { text: <><strong>Talha Aslam</strong> – Excellence Recognition Award of <strong>4,200 €</strong> from Université de Rennes; <strong>2,000 €</strong> Scholarship from Université d'Angers (2021-22)</> },
  { text: <><strong>Saira Alam</strong> – <strong>International</strong> scholarship of <strong>3,500 €</strong> from <strong>Université Sorbonne Nouvelle</strong> (2020-21)</> },
  { text: <><strong>Noman Zia</strong> – <strong>3,000 €</strong> Scholarship from Université de Poitiers; <strong>1,800 €</strong> Scholarship from Université de Tours (2020-21)</> },
  { text: <><strong>Summaya Rashid</strong> – <strong>4,500 €</strong> from Université Paris 1 Panthéon-Sorbonne, <strong>2,800 €</strong> from Université de Montpellier, <strong>2,500 €</strong> from Sciences Po Grenoble (2020-21)</> },
  { text: <><strong>Asad Ullah Khan</strong> – <strong>4,000 €</strong> from Université de Strasbourg and Excellence scholarship of <strong>2,200 €</strong> from Université de Metz (2020-21)</> },
  { text: <><strong>Hina Chaudhry</strong> – Scholarship of <strong>3,200 €</strong> from Université de Bretagne (2020-21)</> },
  { text: <><strong>Raheel Iqbal</strong> – Scholarship of <strong>2,800 €</strong> from Université d'Aix-Marseille (2020-21)</> },
  { text: <><strong>Faiza Mahmood</strong> – Scholarship of <strong>2,500 €</strong> from Université de Caen Normandie (2020-21)</> },
];

// ─── UG Design Data ─────────────────────────────────────────────────────────
const ugDesignData = [
  { text: <><strong>Zara Hassan</strong> – Offered a scholarship of <strong>4,000 €</strong> from Ecole Nationale Supérieure des Arts Décoratifs (ENSAD), <strong>3,500 €</strong> from École Duperré, <strong>2,800 €</strong> from ECV Paris (2023-24)</> },
  { text: <><strong>Ahmed Bilal</strong> – Offered a scholarship of <strong>5,000 €</strong> International Merit Scholarship from Institut Marangoni Paris (2023-24)</> },
  { text: <><strong>Noor Fatima</strong> – Offered a scholarship of <strong>4,500 €</strong> from École Boulle, <strong>2,500 €</strong> per annum from ECV Paris, France (2023-24)</> },
  { text: <><strong>Sadia Anwar</strong> – Offered a scholarship of <strong>3,200 €</strong> per year from Institut Marangoni Paris, <strong>2,000 €</strong> from Esmod Paris, France (2023-24)</> },
  { text: <><strong>Waleed Rauf</strong> – Successfully admitted to <strong>Sciences Po Paris – School of Arts and Design</strong> (2023-24)</> },
  { text: <><strong>Hira Baig</strong> – Offered a scholarship of <strong>3,800 €</strong> from ECV Paris, <strong>4,500 €</strong> from Institut Marangoni Paris, France (2023-24)</> },
  { text: <><strong>Kamil Chaudhry</strong> – Offered a scholarship of <strong>4,200 €</strong> from École Duperré, <strong>5,000 €</strong> from ENSAD Paris, <strong>3,600 €</strong> from Esmod Paris, <strong>3,000 €</strong> from ECV Paris (2023-24)</> },
  { text: <><strong>Madiha Farhan</strong> – Offered a scholarship of <strong>3,000 €</strong> from Strate École de Design, <strong>4,000 €</strong> from ENSAD Paris, <strong>3,200 €</strong> from ISD Valenciennes (2023-24)</> },
  { text: <><strong>Iqra Butt</strong> – Offered a scholarship of <strong>2,500 €</strong> per year from Institut Marangoni Paris (2023-24)</> },
  { text: <><strong>Sundus Mehmood</strong> – Offered a scholarship of <strong>3,500 €</strong> from ESAG Penninghen and <strong>4,500 €</strong> from ENSAD Paris, France (2023-24)</> },
  { text: <><strong>Rimsha Tariq</strong> – Offered a scholarship of <strong>2,800 €</strong> yearly from ESMOD Paris, France and <strong>4,000 €</strong> from California College of the Arts (2023-24)</> },
  { text: <><strong>Yumna Shahid</strong> – Offered <strong>4,800 €</strong> Excellence Award from ECV Paris, <strong>4,500 €</strong> from Institut Marangoni Paris, <strong>2,200 €</strong> per year from Esmod Paris (2023-24)</> },
  { text: <><strong>Daniya Alam</strong> – Offered a scholarship of <strong>3,200 €</strong> from Strate École de Design, <strong>4,000 €</strong> from ENSAD Paris, <strong>2,600 €</strong> from École Duperré (2023-24)</> },
  { text: <><strong>Shayan Raza</strong> – Offered a scholarship of <strong>4,500 €</strong> from ENSAD Paris, <strong>3,800 €</strong> from ECV Design, <strong>2,200 €</strong> yearly from Institut Marangoni (2023-24)</> },
  { text: <><strong>Aiza Khan</strong> – Offered a scholarship of <strong>2,000 €</strong> per year from ESMOD Paris (2023-24)</> },
  { text: <><strong>Misbah Sajid</strong> – Offered a scholarship of <strong>4,000 €</strong> from ENSAD Paris, <strong>3,000 €</strong> from Strate École de Design, France (2023-24)</> },
  { text: <><strong>Rohail Ahmed</strong> – Offered a scholarship of <strong>3,600 €</strong> from ECV Paris, <strong>3,000 €</strong> from École Duperré, <strong>2,500 €</strong> from ISD Valenciennes, <strong>2,000 €</strong> from ESAG Penninghen (2023-24)</> },
  { text: <><strong>Tehreem Asif</strong> – Offered a scholarship of <strong>3,800 €</strong> from Institut Marangoni Paris, <strong>2,200 €</strong> Scholarship from ECV Paris, <strong>2,000 €</strong> from Esmod Paris (2023-24)</> },
  { text: <><strong>Saman Zafar</strong> – Scholarship of 3,000 € from ECV Design, Paris (2022-23)</> },
  { text: <><strong>Amna Pervaiz</strong> – Scholarship of 2,800 € from Institut Marangoni, Paris (2022-23)</> },
  { text: <><strong>Kulsoom Malik</strong> – Scholarship of 2,500 € from Esmod Paris, 1,800 € from ECV Paris, 2,000 € from École Duperré (2022-23)</> },
  { text: <><strong>Basit Nawaz</strong> – Scholarship of 2,600 € from Institut Marangoni Paris, 2,000 € from Esmod Paris (2021-22)</> },
  { text: <><strong>Nadia Younis</strong> – Scholarship of 2,400 € from ECV Paris, 2,800 € from ENSAD Paris and 2,000 € from Strate École de Design (2021-22)</> },
  { text: <><strong>Sumaira Zahid</strong> – 2,200 € Merit Scholarship from Institut Marangoni Paris and 2,000 € Scholarship from Esmod Paris (2021-22)</> },
  { text: <><strong>Talal Mehmood</strong> – 3,000 € Merit Scholarship from ENSAD Paris, 2,500 € from ECV Design Paris (2021-22)</> },
  { text: <><strong>Ume Laila</strong> – 2,800 € scholarship per year from Institut Marangoni, Paris (2020-21)</> },
  { text: <><strong>Farrukh Imran</strong> – Scholarship of 2,500 € from Esmod Paris (2020-21)</> },
  { text: <><strong>Hafiza Sana</strong> – 2,200 € Merit Scholarship from ECV Paris (2020-21)</> },
];

// ─── List Section Component ──────────────────────────────────────────────────
const ScholarshipList = ({ items, inline = false }) => (
  <ul className={`${inline ? "flex flex-wrap gap-3" : "space-y-3"}`}>
    {items.map((item, i) => (
      <li
        key={i}
        className={`list-item-hover flex gap-3 items-start ${inline ? "basis-full sm:basis-[calc(50%-6px)]" : ""}`}
        style={{ animationDelay: `${i * 0.03}s` }}
      >
        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="text-sm text-gray-700 leading-relaxed">{item.text}</span>
      </li>
    ))}
  </ul>
);

// ─── Section Heading ─────────────────────────────────────────────────────────
const SectionHeading = ({ tag: Tag = "h2", children, color = "text-[#0064b0]" }) => (
  <Tag className={`font-bold mb-6 ${color}`} style={{ fontFamily: "'Playfair Display', serif" }}>
    {children}
  </Tag>
);

// ─── Floating Social Bar ──────────────────────────────────────────────────────
const FloatingSocialBar = () => (
  <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none">
    {[
      { href: "https://www.facebook.com/azconsultations", icon: "f" },
      { href: "https://twitter.com/azconsultations", icon: "t" },
      { href: "https://www.linkedin.com/in/syedahmadjalal", icon: "in" },
      { href: "https://www.instagram.com/azconsultations/", icon: "ig" },
    ].map((s, i) => (
      <li key={i}>
        <a href={s.href} target="_blank" rel="noreferrer">
          <span
            className="flex items-center justify-center w-10 h-10 text-white text-xs font-bold mb-[3px] z-50 transition-all duration-500 hover:w-12"
            style={{ background: "rgb(0 100 176)" }}
          >
            {s.icon}
          </span>
        </a>
      </li>
    ))}
  </ul>
);

// ─── CTA Buttons ─────────────────────────────────────────────────────────────
const CTAButtons = () => (
  <>
    {/* Consultation Button */}
    <div className="fixed bottom-6 left-5 z-[999] cursor-pointer">
      <a
        href="/contact"
        className="inline-block text-white text-sm px-3 py-2 rounded"
        style={{ background: "#0064b0" }}
      >
        Request A Consultation
      </a>
    </div>
    {/* WhatsApp Button */}
    <div className="fixed bottom-6 right-8 z-[999] cursor-pointer">
      <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer">
        <i
          className="is-animating"
          style={{
            position: "relative",
            display: "block",
            width: "1em",
            height: "1em",
            fontSize: "60px",
            lineHeight: "60px",
            backgroundColor: "#34a94d",
            borderRadius: ".5em",
            boxShadow: "0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2)",
            transform: "translate3d(0,0,0) scale(1)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            style={{ position: "absolute", top: "25%", left: "25%", width: "50%", height: "50%" }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.526 5.856L.057 23.428a.5.5 0 0 0 .614.614l5.572-1.469A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 0 1-4.998-1.366l-.358-.213-3.305.871.888-3.22-.234-.375A9.793 9.793 0 0 1 2.182 12C2.182 6.568 6.568 2.182 12 2.182S21.818 6.568 21.818 12 17.432 21.818 12 21.818z" />
          </svg>
        </i>
      </a>
    </div>
  </>
);

// ─── Stats Counter Section ────────────────────────────────────────────────────
const StatsSection = () => {
  const stats = [
    { end: 200, suffix: "+", label: "Admissions Secured" },
    { end: 5, suffix: "+", label: "Years of Experience" },
    { end: 50, suffix: "+", label: "University Partners" },
    { end: 10, suffix: "+", label: "Countries" },
  ];
  return (
    <div className="section-bg-blue py-14">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              <AnimatedCounter end={s.end} suffix={s.suffix} />
            </div>
            <div className="text-sm font-medium opacity-90 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Services Section ─────────────────────────────────────────────────────────
const ServicesSection = () => (
  <div className="section-bg-white py-14">
    <div className="max-w-6xl mx-auto px-6">
      <h2
        className="text-2xl md:text-3xl font-bold text-[#0064b0] mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Our Services
      </h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        We provide complete support for your admission process, including:
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "1. University & Program Selection",
            points: [
              "We identify suitable universities and study programs (formations) based on your academic background, career goals, and budget.",
              "University tuition fees depend on the selected formation, university, and city.",
              "After signing our consultancy contract, we will share full details of available universities, programs, and their respective tuition fees.",
              "University fees will be paid directly by the student to the university.",
            ],
          },
          {
            title: "2. Admission Process",
            points: [
              "We apply to universities on your behalf.",
              "We secure your admission and provide the official Admission Letter and all related documents.",
            ],
          },
          {
            title: "3. Document Preparation",
            points: [
              "Preparation of your CV according to French standards.",
              "Writing of a professional Letter of Motivation.",
              "Translation of documents (translation fees are extra and depend on the number and language of documents).",
            ],
          },
          {
            title: "4. Interview Preparation",
            points: [
              "Guidance and preparation for the Campus France and visa interview.",
            ],
          },
        ].map((service, i) => (
          <div key={i} className="bg-[#f8faff] rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-[#193393] mb-3 text-base">{service.title}</h3>
            <ul className="space-y-2">
              {service.points.map((pt, j) => (
                <li key={j} className="flex gap-2 items-start text-sm text-gray-700 leading-relaxed">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Visa Disclaimer */}
      <div className="mt-10 border-l-4 border-[#0064b0] bg-blue-50 rounded-r-xl p-5">
        <h3 className="font-bold text-[#0064b0] mb-2">Visa Application & Disclaimer</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">
          Please note that <strong>we do not sell, arrange, or guarantee visas.</strong> Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Our service covers university search, admission processing, CV preparation, motivation letter, and complete file preparation. Translation fees and insurance costs are not included and must be paid separately by the student.
        </p>
      </div>

      {/* Contact / Signature */}
      <div className="mt-10 bg-[#193393] rounded-xl p-6 text-white">
        <p className="font-semibold mb-1">Office Address</p>
        <p className="text-sm opacity-90 mb-4">A Z Consultations — 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
        <div className="border-t border-white/20 pt-4 text-sm opacity-90 space-y-1">
          <p><strong>Ahmad Jalal Syed</strong></p>
          <p>Education Consultant – France</p>
          <p>Office: Paris / Lahore</p>
          <p>📞 Office: +33 1 83 96 57 23</p>
          <p>📱 Mobile: +33 6 76 90 39 22</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScholarshipsSecured() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const registerSection = (id) => (el) => {
    if (el) {
      el.dataset.id = id;
      sectionRefs.current[id] = el;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#282828" }}>
      <GlobalStyles />
      <FloatingSocialBar />
      <CTAButtons />

      {/* ── Hero Banner Image ── */}
      <div className="overflow-hidden overlay-wrap w-full">
        <img
          src="secured.jpg"
          alt="AZ Consultations Banner"
          className="overlay-img w-full object-cover"
          style={{ maxHeight: "500px" }}
        />
      </div>

      {/* ── Intro Section ── */}
      <div
        ref={registerSection("intro")}
        className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12 items-center"
        style={{
          opacity: visibleSections["intro"] ? 1 : 0,
          transform: visibleSections["intro"] ? "none" : "translateY(28px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#0064b0] mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admissions Secured By AZ Consultations
          </h1>
          <p className="text-gray-600 leading-relaxed text-justify mb-4">
            Greetings from Paris. AZ Consultations believes that every Pakistani student deserves a genuine opportunity to pursue higher education abroad. Since 2020, it has been our constant endeavour to guide students through the admission process in France and beyond. We are proud to present some of our successful students who have been admitted to top universities and awarded scholarships.
          </p>
          <p className="text-gray-600 leading-relaxed text-justify">
            Under the direction of <strong>Syed Ahmad Jalal</strong>, our team provides professional educational consultancy services for students from Pakistan who wish to pursue higher education in France and across Europe.
          </p>
        </div>
        <div className="flex justify-center overflow-hidden overlay-wrap rounded-xl shadow-lg">
          <img
            src="shholarship.png"
            alt="Admissions illustration"
            className="overlay-img w-full max-w-md object-contain"
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsSection />

      {/* ── Services ── */}
      <ServicesSection />

      {/* ── MBA Aspirants ── */}
      <div
        ref={registerSection("mba")}
        className="section-bg-light py-12"
        style={{
          opacity: visibleSections["mba"] ? 1 : 0,
          transform: visibleSections["mba"] ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h5
            className="text-xl font-bold text-[#0064b0] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            MBA Aspirants
          </h5>
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-sm">
              <thead>
                <tr style={{ background: "#0064b0", color: "#fff" }}>
                  <th className="px-4 py-3 text-left font-semibold">Recipients</th>
                  <th className="px-4 py-3 text-left font-semibold">Universities Admitted</th>
                  <th className="px-4 py-3 text-left font-semibold">Scholarship Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Year</th>
                </tr>
              </thead>
              <tbody>
                {mbaData.map((row, i) => (
                  <tr
                    key={i}
                    className="scholarship-row border-b border-gray-100 transition-colors duration-200"
                    style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fbff" }}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.university}</td>
                    <td className="px-4 py-3 font-semibold text-[#0064b0]">{row.amount}</td>
                    <td className="px-4 py-3 text-gray-500">{row.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Masters Students ── */}
      <div
        ref={registerSection("masters")}
        className="section-bg-white py-12"
        style={{
          opacity: visibleSections["masters"] ? 1 : 0,
          transform: visibleSections["masters"] ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading tag="h2">Masters Students</SectionHeading>
          <ScholarshipList items={mastersData} inline={true} />
        </div>
      </div>

      {/* ── UG Non-Design ── */}
      <div
        ref={registerSection("ugnd")}
        className="section-bg-light py-12"
        style={{
          opacity: visibleSections["ugnd"] ? 1 : 0,
          transform: visibleSections["ugnd"] ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading tag="h4">Undergraduate Students – Non Design</SectionHeading>
          <ScholarshipList items={ugNonDesignData} />
        </div>
      </div>

      {/* ── UG Design ── */}
      <div
        ref={registerSection("ugd")}
        className="section-bg-white py-12"
        style={{
          opacity: visibleSections["ugd"] ? 1 : 0,
          transform: visibleSections["ugd"] ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading tag="h4">Undergraduate Students – Design</SectionHeading>
          <ScholarshipList items={ugDesignData} />
        </div>
      </div>
    </div>
  );
}