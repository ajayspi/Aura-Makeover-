"use client";

import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedPrice({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    if (from === to) return;

    const controls = animate(from, to, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        prevValueRef.current = to;
      },
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span className={className}>
      ₹{displayValue.toLocaleString('en-IN')}
    </span>
  );
}
