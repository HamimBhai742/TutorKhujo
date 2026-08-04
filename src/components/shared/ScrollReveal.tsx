"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale";
  delay?: number; // Delay in ms
  duration?: number; // Duration in ms
  threshold?: number; // Intersection threshold
  once?: boolean; // Reveal only once
}

export default function ScrollReveal({
  children,
  className = "",
  variant = "slide-up",
  delay = 0,
  duration = 800,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  // Animation base styles
  const baseStyle = "transition-all ease-[cubic-bezier(0.16,1,0.3,1)]";

  // Transition style overrides for duration and delay
  const styleOverrides = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  // State configurations
  const variants = {
    fade: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    "slide-up": {
      hidden: "opacity-0 translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "slide-down": {
      hidden: "opacity-0 -translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "slide-left": {
      hidden: "opacity-0 translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    "slide-right": {
      hidden: "opacity-0 -translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    scale: {
      hidden: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
  };

  const currentVariant = variants[variant] || variants["slide-up"];
  const animationClass = isRevealed ? currentVariant.visible : currentVariant.hidden;

  return (
    <div
      ref={elementRef}
      className={`${baseStyle} ${animationClass} ${className}`}
      style={styleOverrides}
    >
      {children}
    </div>
  );
}
