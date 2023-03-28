import { k8sListItems, K8sResourceCommon, useK8sModel } from "@openshift-console/dynamic-plugin-sdk";

export function createRevisionURL(repo: string, revision: string) {
    if (!repo || !revision) return undefined;

    if (repo.endsWith(".git")) repo = repo.substring(0, repo.length-4);
    if (repo.endsWith("/")) repo = repo.substring(0, repo.length-1);

    return repo+"/commit/" + revision;
}

export function getFriendlyClusterName(cluster: string) {
    switch (cluster) {
        case "https://kubernetes.default.svc": {
            return "in-cluster"
        }
        default: {
            return cluster;
        }
    }
}

export function getIconForSourceType(sourceType: string) {
    switch (sourceType) {
        case "Helm": {
            return "../../../../images/helm.png"
        }
        case "Kustomize": {
            return "../../../../images/kustomize.png"
        }
        default: {
            return "../../../../images/git.png"
        }
    }
}

export const getArgoServerURL = async (namespace: string) => {

    console.log("namespace = " + namespace);

    const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });
    try {
      const [argoServerURL] = await k8sListItems<K8sResourceCommon>({
        model: model,
        queryParams: {
          ns: namespace,
          labelSelector: {
            matchLabels: {
              'app.kubernetes.io/part-of': 'argocd',
            },
          },
        },
      });
      console.log(argoServerURL);
      console.log("https://" + argoServerURL["spec"]["host"]);
      return "https://" + argoServerURL["spec"]["host"];
    } catch (e) {
      console.warn('Error while fetching Argo CD Server url:', e);
      return '';
    }
  };