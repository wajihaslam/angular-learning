import { httpResource } from '@angular/common/http';
import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { CodeFile } from '../../data/topics';
import { highlight, languageOf } from '../../utils/highlight';

/**
 * Shows project files exactly as they are on disk.
 * angular.json copies the source tree to /source as build assets, and this component loads it at runtime,
 * so what you read here is always the code that is actually running.
 */
@Component({
  selector: 'app-code-viewer',
  templateUrl: './code-viewer.html',
})
export class CodeViewer {
  files = input.required<CodeFile[]>();

  // Resets to the first file whenever a different list of files is passed in.
  active = linkedSignal({ source: this.files, computation: () => 0 });
  file = computed(() => this.files()[this.active()]);
  copied = signal(false);

  // httpResource re-fetches automatically whenever the URL signal changes.
  source = httpResource.text(() => `source/${this.file().path}`);

  notFound = computed(() => {
    if (!this.source.hasValue()) return false;
    // The dev server answers unknown paths with index.html, so treat that as "missing".
    return this.source.value().includes('<app-root>') && !this.file().path.endsWith('index.html');
  });

  text = computed(() => (this.source.hasValue() ? this.source.value().replace(/\r\n/g, '\n').replace(/\n$/, '') : ''));

  lines = computed(() => {
    const focus = this.file().focus ?? [];
    const raw = this.text().split('\n');
    return highlight(this.text(), languageOf(this.file().path)).map((html, i) => ({
      html,
      focused: focus.some((needle) => raw[i]?.includes(needle)),
    }));
  });

  focusCount = computed(() => this.lines().filter((line) => line.focused).length);

  fileName(path: string): string {
    return path.slice(path.lastIndexOf('/') + 1);
  }

  async copy() {
    await navigator.clipboard.writeText(this.text());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
