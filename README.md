# Angular DevOps Lab

A free, open-source learning project for shipping an Angular application with
Docker, Kubernetes, Helm, and GitHub Actions.

## What is included

- Angular 22 app and Jest tests, generated with Angular CLI 22.2.5, styled
  with SCSS
- Multi-stage Node 26 / unprivileged NGINX container and Docker Compose
- Helm chart with a Deployment, Service, health probes, and optional Ingress
- GitHub Actions for pull-request checks, GitHub Pages hosting, and GHCR images
- Optional Jenkins CI and self-hosted Artifactory Community Edition
- A beginner-friendly [learning roadmap](docs/learning-roadmap.md)

## Run locally

Requires Node.js 26 LTS and npm 12.2.1:

```sh
npm install --global npm@12.2.1
npm ci
npm start
```

Open `http://localhost:4200`. To run the production container instead, install
a container runtime and use:

```sh
docker compose up --build
```

Open `http://localhost:8080`.

Run the Jest suite once with `npm run test:unit`; CI uses
`npm run test:ci` to generate coverage and a Jenkins-compatible JUnit report.

## Deploy to local Kubernetes

Install `kubectl`, `kind`, and Helm, then follow the [Kubernetes setup and
study plan](docs/learning-roadmap.md#2-kubernetes-fundamentals).

## Free hosting

GitHub Pages can host the built static Angular site for free. Enable **Settings
→ Pages → GitHub Actions** once; pushes to `main` publish the site. A separate
job publishes containers to GHCR after checks pass. See the roadmap for the
one-time GHCR public-visibility setting and free-tier notes.

**Important:** GitHub Pages serves the static site; it does not host
containers or Kubernetes. The Kubernetes part of this lab runs locally with
`kind`. There is no always-free hosted Kubernetes provider required.

## Study plan

Learn container basics, Kubernetes concepts, cluster operations, Helm, then
CI/CD and production practices. Python is optional and not required for this
starter. See [docs/learning-roadmap.md](docs/learning-roadmap.md).

## Optional Jenkins pipeline

The root `Jenkinsfile` runs Jest, the Angular build, Docker and Helm checks,
then archives the static build. With a self-hosted Artifactory CE configured,
it can upload that archive too. See
[docs/jenkins.md](docs/jenkins.md) for Jenkins/GitHub webhook setup and
Artifactory configuration. GitHub Actions remains the hosted free CI/CD path.
