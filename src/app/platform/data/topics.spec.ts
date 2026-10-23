import { describe, expect, it } from 'vitest';
import { TOPICS, searchTopics } from './topics';

describe('searchTopics', () => {
  it('returns every topic for an empty query', () => {
    expect(searchTopics('   ')).toEqual(TOPICS);
  });

  it('ranks title matches first', () => {
    const results = searchTopics('tailwind');
    expect(results.length).toBeGreaterThan(1);
    expect(results[0].title.toLowerCase()).toContain('tailwind');
  });

  it('requires every word to match', () => {
    expect(searchTopics('switchMap debounceTime').map((t) => t.id)).toContain('rxjs');
    expect(searchTopics('switchMap zzz-not-a-word')).toEqual([]);
  });

  it('gives every topic a unique id', () => {
    const ids = TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
