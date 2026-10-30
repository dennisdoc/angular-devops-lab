# angular-devops-lab

A hands-on DevOps lab showing how to ship an Angular application to
Kubernetes end to end, using only free and open-source tools.

## What it covers

- **Docker**: multi-stage build (Node build → nginx), runtime config via ConfigMap
- **Kubernetes**: Deployment, Service, Ingress, ConfigMaps, rolling updates
  with zero downtime (`maxUnavailable: 0`)
- **Helm**: chart with configurable `values.yaml`, optional SQL init Job
  against Postgres, install / upgrade / rollback
- **Python deploy lifecycle**: `pre.py`, `install.py`, `post.py`,
  `revert.py`, `backup.py` wrapping Helm and kubectl
- **CI/CD**: GitHub Actions (or Jenkins) with lint, Jest, SonarCloud,
  Trivy scan, image push to ghcr.io and a smoke test on a throwaway
  kind cluster

## Architecture

Angular build → Docker image → ghcr.io → Helm chart → Kubernetes (kind)
                                   ↑
                  Python deploy scripts orchestrate each stage

## Quick start

1. `kind create cluster`
2. `docker build -t angular-devops-lab:local .`
3. `kind load docker-image angular-devops-lab:local`
4. `python deploy-src/install.py`
5. `kubectl port-forward svc/angular-devops-lab 8080:80`

## Tech stack

Angular · Docker · nginx · Kubernetes (kind) · Helm · Python ·
GitHub Actions · Jenkins · SonarCloud · Trivy · Postgres

## Goals

Built as a learning project to practice containerization, Kubernetes
operations, Helm packaging and release automation in a realistic setup.
