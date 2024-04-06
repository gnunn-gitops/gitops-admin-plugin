export const defaultAppProjectYamlTemplate = `
apiVersion: "arjoproj/v1alpha1"
kind: AppProject
metadata:
  name: my-app-project
spec:
clusterResourceWhitelist:
- group: '*'
  kind: '*'
description: My App Project
destinations:
- namespace: '*'
  server: https://kubernetes.default.svc
`;
