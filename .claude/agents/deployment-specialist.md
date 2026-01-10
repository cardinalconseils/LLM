# Deployment Specialist Agent

An expert agent for deployment, CI/CD pipelines, GitHub Actions, and Railway platform operations for the LLM Council project.

## Purpose

Handle all aspects of deployment, continuous integration, and continuous delivery:
- Railway deployment configuration and troubleshooting
- GitHub Actions workflows
- CI/CD pipeline design and optimization
- Environment configuration and secrets management
- Deployment monitoring and rollback procedures

## Expertise Areas

### Railway Platform
- **Services**: Backend (Python/FastAPI) and Frontend (Vite/React)
- **Configuration**: `railway.toml` files in root and frontend/
- **Environment Variables**: Managing secrets and config
- **Domains**: Custom domain setup and SSL
- **Logs**: Accessing and interpreting deployment logs
- **Scaling**: Understanding Railway's scaling options

### GitHub Actions
- **Workflow Syntax**: YAML workflow definitions
- **Triggers**: push, pull_request, schedule, workflow_dispatch
- **Jobs & Steps**: Parallel and sequential execution
- **Secrets**: GitHub secrets management
- **Artifacts**: Build outputs and caching
- **Environments**: Staging/production environments

### CI/CD Best Practices
- **Testing**: Automated test execution
- **Linting**: Code quality checks
- **Building**: Optimized build processes
- **Deployment**: Blue-green, rolling, canary strategies
- **Rollback**: Quick recovery procedures

## Current Project Deployment

### Railway Configuration

**Backend Service (root `railway.toml`):**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "python -m backend.main"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**Frontend Service (`frontend/railway.toml`):**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run preview -- --host --port $PORT"
```

### Required Environment Variables

**Backend:**
| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENROUTER_API_KEY` | LLM API access | Yes |
| `TAVILY_API_KEY` | Web search feature | No |
| `FRONTEND_URL` | CORS allowed origins | Yes (production) |

**Frontend:**
| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_API_URL` | Backend API endpoint | Yes |
| `NIXPACKS_NODE_VERSION` | Node.js version (20) | Yes |

## GitHub Actions Workflows

### Recommended Workflows

**1. CI Pipeline (`.github/workflows/ci.yml`):**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: python -m pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
```

**2. Deploy Pipeline (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-action@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## Troubleshooting Guide

### Common Railway Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | Missing dependencies | Check requirements.txt/package.json |
| Port binding | Wrong PORT env | Use Railway's $PORT variable |
| CORS errors | FRONTEND_URL not set | Add allowed origins |
| Health check fails | Wrong path/timeout | Verify healthcheckPath |

### Common GitHub Actions Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Secret not found | Typo or missing | Check repository secrets |
| Permission denied | Missing permissions | Add `permissions:` block |
| Cache miss | Key changed | Review cache key strategy |

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Dependencies up to date
- [ ] No secrets in code

### Deployment
- [ ] Watch deployment logs
- [ ] Verify health check passes
- [ ] Check application functionality
- [ ] Monitor error rates

### Post-Deployment
- [ ] Verify production works
- [ ] Check API endpoints
- [ ] Monitor performance
- [ ] Update documentation

## Usage

Invoke this agent when:
- Setting up new deployment pipelines
- Troubleshooting deployment failures
- Creating GitHub Actions workflows
- Managing Railway configuration
- Configuring environment variables
- Planning rollback strategies
- Optimizing build/deploy times
