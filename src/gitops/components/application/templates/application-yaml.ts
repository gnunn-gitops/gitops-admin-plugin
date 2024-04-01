export const defaultApplicationYamlTemplate = `
apiVersion: "argoproj.io/v1alpha1"
kind: "Application"
metadata:
  name: bgd-app
spec:
  destination:
    server: "https://kubernetes.default.svc"
  project: default
  source:
    path: documentation/modules/ROOT/examples/bgd
    repoURL: "https://github.com/OpenShiftDemos/openshift-gitops-workshop"
    targetRevision: master
  syncPolicy:
    automated:
      prune: true
      selfHeal: false
`;
