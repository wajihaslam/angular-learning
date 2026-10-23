import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, TOPICS, Topic, searchTopics } from '../../data/topics';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  host: { '(document:keydown)': 'onKeydown($event)' },
})
export class Home {
  protected progress = inject(ProgressService);
  private searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  categories = CATEGORIES;
  query = signal('');
  activeCategory = signal<string | null>(null);

  // computed() re-runs only when query or activeCategory changes.
  results = computed(() => {
    const category = this.activeCategory();
    return searchTopics(this.query()).filter((topic) => !category || topic.category === category);
  });

  // Topics grouped by category, skipping categories with no matches.
  groups = computed(() =>
    CATEGORIES.map((category) => ({
      category,
      topics: this.results().filter((topic) => topic.category === category.id),
    })).filter((group) => group.topics.length > 0),
  );

  stats = [
    { value: TOPICS.length, label: 'Lessons' },
    { value: TOPICS.filter((t) => t.demo).length, label: 'Live demos' },
    { value: new Set(TOPICS.flatMap((t) => t.files.map((f) => f.path))).size, label: 'Real source files' },
  ];

  stack = ['Angular 20', 'Signals', 'Zoneless', 'Standalone', 'Reactive Forms', 'RxJS', 'HttpClient', 'Tailwind CSS v4', 'Vitest', 'json-server'];

  firstTopic = TOPICS[0];
  nextTopic = computed(() => TOPICS.find((t) => !this.progress.isDone(t.id)) ?? TOPICS[0]);
  percentDone = computed(() => Math.round((this.progress.count() / TOPICS.length) * 100));

  onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }

  clearSearch() {
    this.query.set('');
    this.searchInput().nativeElement.value = '';
    this.searchInput().nativeElement.focus();
  }

  // Press "/" anywhere on the page to jump to the search box.
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
      event.preventDefault();
      this.searchInput().nativeElement.focus();
    }
  }

  countIn(categoryId: string): number {
    return TOPICS.filter((t) => t.category === categoryId).length;
  }

  levelClass(topic: Topic): string {
    return {
      Beginner: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      Intermediate: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      Advanced: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    }[topic.level];
  }
}
