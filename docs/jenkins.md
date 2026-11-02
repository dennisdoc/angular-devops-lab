# Jenkins and Artifactory CE

Jenkins is an optional, self-hosted CI server. GitHub Actions remains the
zero-server CI and deployment path. The root `Jenkinsfile` runs the same Jest
tests, Angular production build, Docker build, and Helm chart checks. It also
archives the built site and can upload that archive to a self-hosted
Artifactory Community Edition instance.

## What the Jenkins agent needs

Use a Linux agent with:

- Node.js 26 and npm 12.2.1
- Docker CLI connected to a Docker daemon
- Helm 4
- `curl` and `tar`
- Jenkins Pipeline, Git, and JUnit plugins

The agent needs enough permission to run Docker builds. Do not expose a
Docker-capable agent to untrusted pull-request code.

## Trigger from GitHub

1. Install the **GitHub Branch Source** plugin and create a **Multibranch
   Pipeline** pointing at this GitHub repository. Jenkins discovers branches
   containing a `Jenkinsfile` and can build pull requests.
2. Configure the GitHub Branch Source webhook/integration in Jenkins and make
   the Jenkins HTTPS endpoint reachable from GitHub. Set the repository webhook
   to `https://<your-jenkins-host>/github-webhook/` if it is not configured
   automatically.
3. Keep the Jenkinsfile's five-minute SCM polling as a fallback if webhooks
   cannot reach your Jenkins instance.

GitHub Actions continues to run independently. Its existing workflow verifies
the app, publishes GHCR images, and deploys GitHub Pages; Jenkins does not need
GitHub Actions secrets. For public repositories the checkout needs no token;
for private repositories configure a read-only GitHub credential in the branch
source.

## Run Artifactory CE locally

Artifactory CE is open-source/free to self-host; it is not a free hosted
service. It can use substantial memory and disk, so run it on a machine that
can spare those resources rather than on a small CI agent.

```sh
docker compose -f compose.artifactory.yaml up -d
```

Open `http://localhost:8082/ui/`. Complete the first-run setup, create a
**Generic** local repository named `generic-local`, and create a dedicated
user or access token with deploy permission to that repository. The compose
file pins the current OSS release; check JFrog's
[OSS downloads](https://jfrog.com/community/download-artifactory-oss/) before
upgrading it.

## Configure Jenkins artifact upload

In the Jenkins folder or controller configuration, set the environment
variable `ARTIFACTORY_URL` to the Artifactory base URL, for example
`http://<artifactory-host>:8082` (without `/artifactory`). Create a Jenkins
**Username with password** credential with ID `artifactory-credentials` using
the dedicated Artifactory account/token. Ensure the configured `generic-local`
repository and the Jenkins agent can reach each other.

Only builds for `main` upload to Artifactory. Never make deployment credentials
available to untrusted fork pull requests; configure branch-source trust and
agent permissions accordingly.

Builds archive the static site as
`angular-devops-lab-<commit-sha>.tar.gz`. When Artifactory is configured, the
same archive is uploaded under
`generic-local/angular-devops-lab/<commit-sha>/`.

The pipeline intentionally does not deploy to a remote Kubernetes cluster.
That requires cluster credentials and a reachable cluster; practice deployment
locally with the documented `kind` and Helm workflow instead.
