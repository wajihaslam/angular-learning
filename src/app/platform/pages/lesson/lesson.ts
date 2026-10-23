import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CodeViewer } from '../../components/code-viewer/code-viewer';
import { CATEGORIES, TOPICS, categoryOf, findTopic, searchTopics } from '../../data/topics';
import { ProgressService } from '../../services/progress.service';
import { formatInline } from '../../utils/format';

type TabId = 'learn' | 'demo' | 'code' | 'tests' | 'practice';

@Component({
  selector: 'app-lesson',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet, CodeViewer],
  templateUrl: './lesson.html',
})
export class Lesson {
  private router = inject(Router);
  private title = inject(Title);
  protected progress = inject(ProgressService);

  // Filled by the router thanks to withComponentInputBinding(): /learn/:topicId?tab=code
  topicId = input.required<string>();
  tab = input<string>();

  topic = computed(() => findTopic(this.topicId()));
  category = computed(() => {
    const topic = this.topic();
    return topic ? categoryOf(topic) : undefined;
  });

  tabs = computed(() => {
    const topic = this.topic();
    if (!topic) return [];
    const tabs: { id: TabId; label: string }[] = [{ id: 'learn', label: 'Learn' }];
    if (topic.demo) tabs.push({ id: 'demo', label: 'Live demo' });
    tabs.push({ id: 'code', label: `Code (${topic.files.length})` });
    if (topic.tests?.length) tabs.push({ id: 'tests', label: 'Tests' });
    tabs.push({ id: 'practice', label: 'Practice' });
    return tabs;
  });

  activeTab = computed<TabId>(() => {
    const requested = this.tab();
    return this.tabs().find((t) => t.id === requested)?.id ?? 'learn';
  });

  position = computed(() => TOPICS.findIndex((t) => t.id === this.topicId()));
  previous = computed(() => TOPICS[this.position() - 1]);
  next = computed(() => TOPICS[this.position() + 1]);

  // Sidebar
  query = signal('');
  menuOpen = signal(false);
  sidebarGroups = computed(() => {
    const results = searchTopics(this.query());
    return CATEGORIES.map((category) => ({
      category,
      topics: results.filter((t) => t.category === category.id),
    })).filter((group) => group.topics.length > 0);
  });

  total = TOPICS.length;
  format = formatInline;

  constructor() {
    effect(() => {
      const topic = this.topic();
      this.title.setTitle(topic ? `${topic.title} · Angular Learning Platform` : 'Angular Learning Platform');
    });

    // Go back to the top and close the mobile menu when the lesson changes.
    effect(() => {
      this.topicId();
      this.menuOpen.set(false);
      window.scrollTo({ top: 0 });
    });
  }

  selectTab(tab: TabId) {
    this.router.navigate([], {
      queryParams: { tab: tab === 'learn' ? null : tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
