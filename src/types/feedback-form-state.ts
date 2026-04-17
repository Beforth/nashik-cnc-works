export type FeedbackFormState = {
  ok: boolean | null;
  error: string;
};

export const FEEDBACK_FORM_INITIAL_STATE: FeedbackFormState = { ok: null, error: '' };
