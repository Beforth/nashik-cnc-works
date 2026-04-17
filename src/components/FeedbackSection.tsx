'use client';

import React, { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'motion/react';
import { CheckCircle2, MessageSquareQuote } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { cn } from '@/src/lib/utils';
import { submitFeedbackForm } from '@/src/actions/feedback-form';
import { FEEDBACK_FORM_INITIAL_STATE } from '@/src/types/feedback-form-state';

const RATINGS = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;

function SubmitFeedbackButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-machine-orange py-4 text-lg font-black text-white shadow-xl transition-all hover:bg-navy disabled:opacity-70"
    >
      <MessageSquareQuote size={22} />
      {pending ? 'Submitting…' : 'Submit feedback'}
    </button>
  );
}

function ConnectedFeedbackForm({ onSendMore }: { onSendMore: () => void }) {
  const [state, formAction] = useActionState(submitFeedbackForm, FEEDBACK_FORM_INITIAL_STATE);
  const [rating, setRating] = useState<(typeof RATINGS)[number] | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const displayError = clientError || (state.ok === false ? state.error : null);

  if (state.ok === true) {
    return (
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="py-10 text-center"
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-light text-machine-green shadow-sm">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-3xl font-extrabold text-navy">Thank you</h3>
        <p className="mt-3 text-lg text-muted-grey">Your feedback was submitted successfully.</p>
        <button
          type="button"
          onClick={onSendMore}
          className="mt-8 rounded-xl bg-navy px-8 py-3 font-bold text-white transition-colors hover:bg-machine-orange"
        >
          Send more feedback
        </button>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
      noValidate
      onSubmit={(e) => {
        if (!rating) {
          e.preventDefault();
          setClientError('Please select a rating.');
          return;
        }
        setClientError(null);
      }}
    >
      {displayError ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
          role="alert"
        >
          {displayError}
        </p>
      ) : null}

      <input type="hidden" name="rating" value={rating ?? ''} aria-hidden />

      <div role="group" aria-labelledby="feedback-rating-legend">
        <p id="feedback-rating-legend" className="mb-3 text-sm font-bold text-navy">
          How would you rate your experience?
          <span className="text-machine-orange" aria-hidden="true">
            {' '}
            *
          </span>
          <span className="sr-only"> (required)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {RATINGS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setRating(label);
                setClientError(null);
              }}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-bold transition-all md:text-sm',
                rating === label
                  ? 'border-machine-orange bg-machine-orange text-white shadow-md'
                  : 'border-border-grey bg-bg-cloud/40 text-muted-grey hover:border-machine-orange/50 hover:bg-machine-orange/5',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <input
          required
          type="text"
          id="feedback-name"
          name="name"
          autoComplete="name"
          placeholder=" "
          className="peer block w-full appearance-none rounded-2xl border border-border-grey bg-bg-cloud/30 px-5 py-4 text-navy transition-all focus:border-machine-orange focus:bg-white focus:outline-none"
        />
        <label
          htmlFor="feedback-name"
          className="pointer-events-none absolute left-4 top-0 z-10 origin-[0] -translate-y-1/2 scale-75 transform bg-white px-2 text-sm font-bold text-muted-grey duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-machine-orange"
        >
          Your name *
        </label>
      </div>

      <div className="relative group">
        <textarea
          id="feedback-message"
          name="message"
          rows={4}
          placeholder=" "
          className="peer block w-full resize-none appearance-none rounded-2xl border border-border-grey bg-bg-cloud/30 px-5 py-4 text-navy transition-all focus:border-machine-orange focus:bg-white focus:outline-none"
        />
        <label
          htmlFor="feedback-message"
          className="pointer-events-none absolute left-4 top-0 z-10 origin-[0] -translate-y-1/2 scale-75 transform bg-white px-2 text-sm font-bold text-muted-grey duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-machine-orange"
        >
          Write your feedback here…
        </label>
      </div>

      <SubmitFeedbackButton />
    </form>
  );
}

export default function FeedbackSection() {
  const [formKey, setFormKey] = useState(0);

  return (
    <section id="feedback" className="relative overflow-hidden border-y border-border-grey/40 bg-gradient-to-b from-white to-bg-cloud/40 px-4 py-24">
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-machine-orange/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-navy/[0.04] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <SectionHeading
          kicker="Feedbacks"
          title="Feedback"
          description="Tell us how we did — same quick flow as on our digital profile card."
          align="center"
          className="mb-12"
        />

        <div className="rounded-[2rem] border border-border-grey bg-white p-8 shadow-2xl md:p-10">
          <ConnectedFeedbackForm key={formKey} onSendMore={() => setFormKey((k) => k + 1)} />
        </div>
      </div>
    </section>
  );
}
