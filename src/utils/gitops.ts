import { ApplicationKind } from "@application-model";
import { k8sListItems, K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

export function createRevisionURL(repo: string, revision: string) {
  if (!repo || !revision) return undefined;

  if (repo.endsWith(".git")) repo = repo.substring(0, repo.length - 4);
  if (repo.endsWith("/")) repo = repo.substring(0, repo.length - 1);

  return repo + "/commit/" + revision;
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

export function getDuration(startAt: string, finishAt: string) {
  try {
    var start:Date = new Date(startAt);
    var finish:Date = new Date(finishAt);

    return finish.getTime() - start.getTime();
  } catch(e) {
    console.log("Error calculating duration", e);
    return 0;
  }
}

export type ArgoServer = {
  host: string,
  protocol: string,
}

export const getArgoServer = async (model, app: ApplicationKind): Promise<ArgoServer> => {

  var info: ArgoServer = {
      host: "",
      protocol: "",
  }

  try {
    const [argoServerURL] = await k8sListItems<K8sResourceCommon>({
      model: model,
      queryParams: {
        ns: app.metadata.namespace,
        labelSelector: {
          matchLabels: {
            'app.kubernetes.io/part-of': 'argocd',
          },
        },
      },
    });
    // TODO - Don't hardcode this, determine from route
    info.protocol = "https";
    info.host = argoServerURL["spec"]["host"]
    console.log("Argo Server is: " + info);
    return info;
  } catch (e) {
    console.warn('Error while fetching Argo CD Server url:', e);
    return info;
  }
};