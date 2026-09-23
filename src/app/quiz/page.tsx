"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import StyleQuiz, { QuizAnswers } from '@/components/StyleQuiz';
import { answersToTags, tagsToWhatsAppMessage, tagsToEstimatorPrefill } from '@/lib/quiz-to-tags';

const DEFAULT_WHATSAPP = '919700675637';

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem('auro:session-id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('auro:session-id', id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export default function QuizPage() {
  const router = useRouter();

  const openWhatsApp = (tags: ReturnType<typeof answersToTags>, number: string, customerName?: string) => {
    window.open(`https://wa.me/${number}?text=${tagsToWhatsAppMessage(tags, undefined, customerName)}`, '_blank');
  };

  const handleComplete = (answers: QuizAnswers) => {
    const tags = answersToTags(answers);
    const prefill = tagsToEstimatorPrefill(tags);

    // Store prefill for estimator
    sessionStorage.setItem('estimator_prefill', JSON.stringify(prefill));

    // Navigate to estimator immediately; WhatsApp follows once the lead is persisted
    router.push(`/#estimator?prefill=${encodeURIComponent(JSON.stringify(prefill))}`);

    // Lead capture (R11): name + phone travel with the quiz answers so the
    // assigned agent can reach the prospect directly
    const { customerName, phone, ...quizAnswers } = answers;

    // Persist lead + resolve assigned agent; fall back to default number on any failure
    fetch('/api/leads/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: quizAnswers, sessionId: getSessionId(), customerName, phone }),
    })
      .then((r) => r.json())
      .then((d) => openWhatsApp(tags, d?.assignedWhatsapp || DEFAULT_WHATSAPP, customerName))
      .catch(() => openWhatsApp(tags, DEFAULT_WHATSAPP, customerName));
  };

  return (
    <main className="min-h-screen">
      <StyleQuiz onComplete={handleComplete} />
    </main>
  );
}
