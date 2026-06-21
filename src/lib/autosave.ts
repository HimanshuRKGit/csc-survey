import { SurveyResponse, submitSurvey } from './supabase';

const DRAFT_KEY = 'csc-survey-draft';
const QUEUE_KEY = 'csc-survey-queue';

export function saveFormData(data: Partial<SurveyResponse> & { researcher_name?: string }) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadFormData(): (Partial<SurveyResponse> & { researcher_name?: string }) | null {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function clearFormData() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function queueSubmission(data: SurveyResponse) {
  try {
    const queue = getQueuedSubmissions();
    queue.push(data);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
}

export function getQueuedSubmissions(): SurveyResponse[] {
  try {
    const saved = localStorage.getItem(QUEUE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function processQueue(): Promise<number> {
  const queue = getQueuedSubmissions();
  if (queue.length === 0) return 0;

  let successCount = 0;
  const remaining: SurveyResponse[] = [];

  for (const entry of queue) {
    try {
      await submitSurvey(entry);
      successCount++;
    } catch {
      remaining.push(entry);
    }
  }

  try {
    if (remaining.length > 0) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch {
    // ignore
  }

  return successCount;
}
