# GitHub Actions Setup

## Files Added

- `.github/workflows/deploy.yml`
- `appspec.yml`
- `task-definition.backend.json`
- `task-definition.frontend.json`

## What The Workflow Deploys

The workflow now deploys two ECS services:

- `deploy-backend`: backend image, database migration, ECS blue/green deployment
- `deploy-frontend`: frontend image, ECS blue/green deployment

The frontend and backend are treated as separate services in the same microservice deployment model.

## Required GitHub Secrets

Add these in `Settings -> Secrets and variables -> Actions -> Secrets`:

- `AWS_ROLE_ARN`
- `FLYWAY_URL`
- `FLYWAY_USER`
- `FLYWAY_PASSWORD`

Notes:

- `AWS_ROLE_ARN` is the IAM role assumed through GitHub OIDC.
- `FLYWAY_URL` must be a JDBC URL, for example:
  `jdbc:postgresql://your-rds-endpoint:5432/postgres`

## Required Shared GitHub Variables

Add these in `Settings -> Secrets and variables -> Actions -> Variables`:

- `AWS_REGION`
- `ECS_CLUSTER`

## Required Backend GitHub Variables

- `BACKEND_ECR_REPOSITORY`
- `BACKEND_ECS_SERVICE`
- `BACKEND_ECS_CONTAINER_NAME`
- `BACKEND_ECS_CONTAINER_PORT`
- `BACKEND_ECS_TASK_FAMILY`
- `BACKEND_ECS_TASK_EXECUTION_ROLE_ARN`
- `BACKEND_ECS_TASK_ROLE_ARN`
- `BACKEND_ECS_CPU`
- `BACKEND_ECS_MEMORY`
- `BACKEND_ECS_LOG_GROUP`
- `BACKEND_CODEDEPLOY_APP_NAME`
- `BACKEND_CODEDEPLOY_DEPLOYMENT_GROUP`
- `DATABASE_URL_SECRET_ARN`
- `REDIS_URL_SECRET_ARN`
- `SESSION_SECRET_ARN`

Recommended initial values:

- `BACKEND_ECS_CONTAINER_NAME=techstore-backend`
- `BACKEND_ECS_CONTAINER_PORT=8080`
- `BACKEND_ECS_CPU=512`
- `BACKEND_ECS_MEMORY=1024`

## Required Frontend GitHub Variables

- `FRONTEND_ECR_REPOSITORY`
- `FRONTEND_ECS_SERVICE`
- `FRONTEND_ECS_CONTAINER_NAME`
- `FRONTEND_ECS_CONTAINER_PORT`
- `FRONTEND_ECS_TASK_FAMILY`
- `FRONTEND_ECS_TASK_EXECUTION_ROLE_ARN`
- `FRONTEND_ECS_TASK_ROLE_ARN`
- `FRONTEND_ECS_CPU`
- `FRONTEND_ECS_MEMORY`
- `FRONTEND_ECS_LOG_GROUP`
- `FRONTEND_CODEDEPLOY_APP_NAME`
- `FRONTEND_CODEDEPLOY_DEPLOYMENT_GROUP`

Recommended initial values:

- `FRONTEND_ECS_CONTAINER_NAME=techstore-frontend`
- `FRONTEND_ECS_CONTAINER_PORT=80`
- `FRONTEND_ECS_CPU=256`
- `FRONTEND_ECS_MEMORY=512`

## Secrets Manager / Parameter Store Note

- The backend ECS task definition is rendered with ECS `secrets`, not plain environment values.
- `DATABASE_URL_SECRET_ARN`, `REDIS_URL_SECRET_ARN`, and `SESSION_SECRET_ARN` should point to Secrets Manager or SSM values that ECS can read at runtime.
- The backend task execution role must have permission to read those secret values.

## OIDC Trust Setup

Your AWS IAM role must trust GitHub's OIDC provider and allow this repository to assume it.

At minimum, the workflow needs permissions for:

- ECR push
- ECS task definition registration
- CodeDeploy deployment creation
- CloudWatch logs access used by the task definitions

## How To Test

### 1. Test the workflow without AWS deployment

This is the safest first test.

1. Push the branch to GitHub.
2. Open `Actions -> Deploy`.
3. Click `Run workflow`.
4. Leave `Run AWS deploy steps` unchecked.
5. Run it.

This validates:

- checkout
- backend install
- frontend install
- backend syntax check
- frontend build
- backend image build
- frontend image build

### 2. Test the workflow with AWS deployment

Only do this after all secrets and variables are configured.

1. Open `Actions -> Deploy`.
2. Click `Run workflow`.
3. Set `Run AWS deploy steps` to `true`.
4. Optionally set `backend_app_version` to something visible like `V1 (Green Test)`.
5. Optionally set `frontend_image_tag` if you want a custom frontend tag.
6. Run it.

This validates:

- AWS OIDC authentication
- Flyway migration execution
- backend image push to ECR
- frontend image push to ECR
- backend ECS task definition rendering
- frontend ECS task definition rendering
- backend CodeDeploy blue/green deployment
- frontend CodeDeploy blue/green deployment

### 3. Test on push to main

Once manual tests pass, merge into `main`.

Pushes to `main` automatically run the deploy workflow with AWS deploy steps enabled.

## Expected Deployment Behavior

When the full deploy path runs successfully:

- backend migrations run first
- backend image is pushed to ECR
- backend green task set is deployed through CodeDeploy
- frontend image is pushed to ECR
- frontend green task set is deployed through CodeDeploy

## Important Current Limitation

The workflow renders both ECS task definitions dynamically from GitHub variables.
That means the repo is portable, but it also means the GitHub variables and backend secret ARNs must be correct before the deploy path can succeed.

The current `appspec.yml` is only a static reference file.
The workflow renders service-specific AppSpec files during the run.

The current setup does not yet define a CodeDeploy hook Lambda that calls `/test/smoke` before backend traffic cutover.
That is the next piece to add once the base deployment path is working.
