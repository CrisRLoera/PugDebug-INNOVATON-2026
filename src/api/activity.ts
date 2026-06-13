import { USE_MOCK, BASE_URL, post } from './client';
import { MOCK_ACTIVITY, MOCK_SUMMARY } from '../mock/activity';
import type { ActivityItem, ActivitySummary } from '../types';

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ActivityResponse {
  items: ActivityItem[];
  summary: ActivitySummary;
}

export async function getActivity(userId: string): Promise<ActivityResponse> {
  if (USE_MOCK) {
    await delay();
    return { items: MOCK_ACTIVITY, summary: MOCK_SUMMARY };
  }
  return post<ActivityResponse>(BASE_URL.activity.list, { userId });
}
