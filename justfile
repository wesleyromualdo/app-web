ecs_service := env_var_or_default('ECS_SERVICE', 'production-plataforma-web')
aws_region := env_var_or_default('AWS_REGION', 'us-east-1')
image := env_var_or_default('IMAGE', 'some-ecr-addr')
version := env_var_or_default('VERSION', 'dev')

pipeline_repo_url := env_var_or_default('PIPELINE_ECR_URL', 'public.ecr.aws/n8p0k3l7/pipeline-tools')


render-ecs-task-definition:
    aws ecs describe-task-definition \
                --task-definition {{ ecs_service }} \
                --region {{ aws_region }} \
                --query 'taskDefinition' |\
                jq '.containerDefinitions[0].image="{{image}}:{{version}}"' > task_definition.json

pull-ecs-env-merger:
    oras pull {{pipeline_repo_url}}:ecs-env-merger_latest
    