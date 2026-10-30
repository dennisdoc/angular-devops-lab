import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly stages = [
    { number: '01', title: 'Build', detail: 'Angular, tests, and a production bundle' },
    { number: '02', title: 'Package', detail: 'A small, non-root Docker image' },
    { number: '03', title: 'Deploy', detail: 'Kubernetes resources managed by Helm' },
    { number: '04', title: 'Automate', detail: 'GitHub Actions, Pages, and GHCR' },
  ];
}
