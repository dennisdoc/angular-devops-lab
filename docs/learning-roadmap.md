# Angular DevOps learning roadmap

This lab is designed for an Angular developer who is new to containers and
operations. Work through the stages in order; Python is optional and is not
needed to build or deploy the starter.

## Before you start

- Git and a free GitHub account
- Node.js 26 LTS and npm 12.2.1 (`npm install --global npm@12.2.1`)
- Docker Engine, or Podman; on Windows, run a Linux container runtime through
  WSL 2
- `kubectl`, `kind`, and Helm

These are free tools. Docker Desktop is free for personal use, education,
non-commercial open-source work, and qualifying small businesses; check its
current license for your situation. Podman is a free, open-source alternative.

## Stages

### 1. Containerization fundamentals

Learn images versus containers, layers, registries, ports, and build context.
Read the root `Dockerfile` and `.dockerignore`, then:

```sh
npm ci
npm start
docker compose up --build
```

Open `http://localhost:8080`. Rebuild after a small Angular change and explain
which Docker layers were reused.

### 2. Kubernetes fundamentals

Learn the control plane (API server, scheduler, controller manager, and etcd),
nodes, Pods, Deployments, Services, DNS, ConfigMaps, Secrets, and storage. Create
a local cluster and deploy the image:

```sh
kind create cluster
docker build -t angular-devops-lab:local .
kind load docker-image angular-devops-lab:local
helm upgrade --install angular-devops-lab ./helm/angular-devops-lab --set image.repository=angular-devops-lab --set image.tag=local --set image.pullPolicy=IfNotPresent
kubectl port-forward svc/angular-devops-lab 8080:80
```

Visit `http://localhost:8080`. For Podman, use the matching `kind` provider and
image-loading command for your local setup.

### 3. Kubernetes operations

Practice `kubectl get`, `describe`, `logs`, `exec`, `events`, `top`, namespaces,
and `rollout`. Inspect the health probes and resource requests in the chart.
Scale the Deployment, delete a Pod, watch it recover, and try a deliberately bad
image tag before rolling back.

### 4. Helm

Read `Chart.yaml`, `values.yaml`, and `templates/`. Change a value, render the
chart with `helm template`, inspect the result, then upgrade and roll back:

```sh
helm template angular-devops-lab ./helm/angular-devops-lab
helm history angular-devops-lab
helm rollback angular-devops-lab
```

### 5. CI/CD and free hosting

Run `npm run test:unit` to execute Jest locally. `npm run test:ci` also writes
coverage and a JUnit XML report under `reports/junit/`. The GitHub Actions
workflow runs that same test script, builds the Docker image, and validates
the Helm chart on pull requests. After those checks pass on `main`, it deploys
the static Angular site to GitHub Pages and publishes the container to GitHub
Container Registry (GHCR).

1. Push this repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the build and
   deployment source.
3. Merge a change into `main`; the Pages workflow publishes the site at
   `https://dennisdoc.github.io/angular-devops-lab/`.
4. After the first image publish, change its GHCR package visibility to
   **Public** if you want to pull it anonymously into your local cluster.

GitHub Pages and public GHCR packages are free for a public repository.
GitHub-hosted CI is free within GitHub's current plan limits. Pages is static
hosting; it does not run your Docker image or provide a Kubernetes cluster.
There is no reliable, permanently free hosted Kubernetes service assumed by
this lab, so Kubernetes practice uses `kind` on your own machine. The chart
defaults to the mutable `latest` image tag for this learning lab; use the
published commit SHA as `image.tag` when you want to practice immutable deploys.
For an optional Jenkins pipeline and self-hosted Artifactory CE, see
[docs/jenkins.md](jenkins.md).

### 6. Python for deployment automation (optional)

You do not need Python for the Angular, Docker, Helm, or GitHub Actions stages.
If you want to add the lifecycle scripts shown in the architecture reference,
learn Python basics first: virtual environments, functions, lists and
dictionaries, exceptions, and `pathlib`. Then write a small wrapper using
`subprocess.run([...], check=True)` to call one Helm command. Grow it into
separate pre-deploy, install, post-deploy, and rollback steps only when each
step has a clear job. Keep credentials out of scripts, images, and Git.

### 7. Next steps: production concepts

Add a ConfigMap-backed runtime API URL, TLS and an Ingress controller, resource
monitoring, image vulnerability scanning, and a release strategy. Add a small
database-backed service before learning database backups or persistent volumes.
