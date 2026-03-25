"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SQRT_5000 = Math.sqrt(5000);
const PLAYFAIR = "'Playfair Display', Georgia, serif";
const DM_SANS = "'DM Sans', sans-serif";

const testimonials = [
  {
    tempId: 0,
    testimonial: "AZ Consultations made the whole process seamless. From choosing Sorbonne to getting my visa within 3 weeks, they handled everything. The French classes also gave me the confidence to settle in Paris quickly.",
    by: "Ayesha Rahman, Master's in International Law — Sorbonne, Paris",
    initials: "AR",
    color: "#002395"
  },
  {
    tempId: 1,
    testimonial: "Being based in France, the AZ team truly understands what the consulate looks for. My visa was approved in 18 days with zero complications. Their document checklist was so thorough — I've never felt so prepared.",
    by: "Karim Benali, Engineering — École Polytechnique, Paris",
    initials: "KB",
    color: "#c9a84c"
  },
  {
    tempId: 2,
    testimonial: "I started with zero French. AZ enrolled me in their B1 course and by the time I arrived in Lyon, I could confidently navigate the city, open a bank account, and attend lectures.",
    by: "Zara Hussain, BSc Biology — Université de Lyon",
    initials: "ZH",
    color: "#ED2939"
  },
  {
    tempId: 3,
    testimonial: "The team at AZ Consultations is like family. They responded to every message — even late evenings. Two years later, I'm now doing my PhD at Grenoble and still recommend them to every student I meet.",
    by: "Mohamed El-Amin, PhD Candidate — Université Grenoble Alpes",
    initials: "ME",
    color: "#005a8e"
  },
  {
    tempId: 4,
    testimonial: "I applied to 4 universities with AZ's help and got accepted into all 4. Their motivation letter writing service was exceptional — it truly reflected who I am. I chose HEC Paris and it's been life-changing.",
    by: "Sophia Nkemdirim, MBA — HEC Paris",
    initials: "SN",
    color: "#4a1060"
  },
  {
    tempId: 5,
    testimonial: "What sets AZ apart is that they're actually in France. When I had issues with my CAF housing allowance after arrival, they guided me through it. Most agencies disappear after the visa — not AZ.",
    by: "Omar Abdullah, Master's in Data Science — INSA Lyon",
    initials: "OA",
    color: "#006633"
  }
];

const Avatar = ({ initials, color, size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: PLAYFAIR,
      fontWeight: 700,
      fontSize: size * 0.35,
      color: '#fff',
      flexShrink: 0,
      boxShadow: '3px 3px 0px rgba(0,0,0,0.15)'
    }}
  >
    {initials}
  </div>
);

const TestimonialCard = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        cursor: 'pointer',
        width: cardSize,
        height: cardSize,
        padding: '32px',
        border: isCenter
          ? `2px solid #002395`
          : `2px solid #e5e7eb`,
        background: isCenter ? '#002395' : '#fff',
        clipPath: `polygon(44px 0%, calc(100% - 44px) 0%, 100% 44px, 100% 100%, calc(100% - 44px) 100%, 44px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? '0px 8px 0px 4px #e5e7eb'
          : '0px 0px 0px 0px transparent',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isCenter ? 10 : 0,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Corner cut diagonal line */}
      <span
        style={{
          position: 'absolute',
          display: 'block',
          right: -2,
          top: 42,
          width: SQRT_5000,
          height: 2,
          background: isCenter ? 'rgba(255,255,255,0.25)' : '#e5e7eb',
          transformOrigin: 'top right',
          transform: 'rotate(45deg)',
        }}
      />

      {/* Stars */}
      <div style={{
        color: '#c9a84c',
        fontSize: 13,
        marginBottom: 14,
        letterSpacing: 2
      }}>
        ★★★★★
      </div>

      {/* Avatar */}
      <Avatar
        initials={testimonial.initials}
        color={isCenter ? 'rgba(255,255,255,0.2)' : testimonial.color}
        size={48}
      />

      {/* Quote */}
      <p style={{
        fontFamily: PLAYFAIR,
        fontSize: cardSize > 300 ? 14 : 12,
        lineHeight: 1.7,
        color: isCenter ? 'rgba(255,255,255,0.9)' : '#374151',
        fontStyle: 'italic',
        marginTop: 16,
        flex: 1,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
      }}>
        "{testimonial.testimonial}"
      </p>

      {/* Name */}
      <p style={{
        position: 'absolute',
        bottom: 28,
        left: 32,
        right: 32,
        fontSize: 11.5,
        fontWeight: 600,
        color: isCenter ? 'rgba(255,255,255,0.65)' : '#6b7280',
        letterSpacing: 0.2,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        — {testimonial.by}
      </p>
    </div>
  );
};

export const AZTestimonials = () => {
  const [cardSize, setCardSize] = useState(365);
  const [list, setList] = useState(testimonials);
  const counterRef = useRef(testimonials.length);

  const nextId = () => {
    counterRef.current += 1;
    return counterRef.current;
  };

  const handleMove = (steps) => {
    setList((prev) => {
      const newList = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return prev;
          newList.push({ ...item, tempId: nextId() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return prev;
          newList.unshift({ ...item, tempId: nextId() });
        }
      }
      return newList;
    });
  };

  useEffect(() => {
    const update = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCardSize(matches ? 365 : 290);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div id="testimonials"  style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', padding: '64px 24px 0' }}>
        <span style={{
          display: 'inline-block',
          background: '#f5e9c8',
          color: '#c9a84c',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          padding: '5px 14px',
          borderRadius: 50,
          border: '1px solid rgba(201,168,76,0.3)',
          marginBottom: 12
        }}>
          Student Stories
        </span>
        <h2 style={{
          fontFamily: PLAYFAIR,
          fontSize: 'clamp(26px, 3.5vw, 40px)',
          fontWeight: 700,
          color: '#00185a',
          lineHeight: 1.2,
          margin: '0 0 8px'
        }}>
          What Our Students <em style={{ fontStyle: 'italic', color: '#002395' }}>Say About Us</em>
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 420, margin: '0 auto' }}>
          Real stories from students we've guided to French universities.
        </p>
      </div>

      {/* Carousel */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 600,
        overflow: 'hidden',
        background: '#faf8f4',
      }}>
        {list.map((t, index) => {
          const position = list.length % 2
            ? index - (list.length + 1) / 2
            : index - list.length / 2;
          return (
            <TestimonialCard
              key={t.tempId}
              testimonial={t}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        {/* Navigation */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}>
          {[
            { label: 'Previous', steps: -1, icon: <ChevronLeft size={20} /> },
            { label: 'Next', steps: 1, icon: <ChevronRight size={20} /> }
          ].map(({ label, steps, icon }) => (
            <button
              key={label}
              onClick={() => handleMove(steps)}
              aria-label={label}
              style={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                border: '2px solid #e5e7eb',
                cursor: 'pointer',
                color: '#00185a',
                transition: 'all 0.2s',
                clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% 100%, calc(100% - 10px) 100%, 10px 100%, 0 100%, 0 0)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#002395';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#002395';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#00185a';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AZTestimonials;