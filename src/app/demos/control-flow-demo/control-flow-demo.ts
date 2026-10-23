import { Component, signal } from '@angular/core';

type Status = 'idle' | 'loading' | 'error';

@Component({
  selector: 'app-control-flow-demo',
  templateUrl: './control-flow-demo.html',
})
export class ControlFlowDemo {
  status = signal<Status>('idle');
  showList = signal(true);
  fruits = signal([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ]);
  private nextId = 4;

  addFruit() {
    const id = this.nextId++;
    this.fruits.update((list) => [...list, { id, name: `Fruit #${id}` }]);
  }

  removeFruit(id: number) {
    this.fruits.update((list) => list.filter((f) => f.id !== id));
  }
}
