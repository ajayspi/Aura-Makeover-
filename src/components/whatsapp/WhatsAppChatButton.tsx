"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppChatButton() {
  const handleChat = () => {
    // Fallback/direct link for offline or manual support chat
    const text = "Hi AuroMakeover Support, I need some help with my booking.";
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button
      onClick={handleChat}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-xl transition-transform active:scale-95 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
