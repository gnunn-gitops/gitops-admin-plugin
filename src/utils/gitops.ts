import { ApplicationKind } from "@application-model";
import { k8sListItems, K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

export const annotationRefreshKey = "argocd.argoproj.io/refresh";
export const labelControllerNamespaceKey = "gitops.openshift.io/controllerNamespace";

export function isApplicationRefreshing(app: K8sResourceCommon):boolean {
  // if (app == undefined) return false;
  // if (app.metadata.annotations == undefined) return false;
  // return app.metadata.annotations[annotationRefreshKey] == "refreshing";
  return (app && app.metadata && app.metadata.annotations && app.metadata.annotations !=undefined && app.metadata.annotations[annotationRefreshKey] == "refreshing");
}

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

  const ns = ():string => {
    if (app.status?.controllerNamespace) return app.status?.controllerNamespace;
    else if (app.metadata?.labels && app.metadata.labels[labelControllerNamespaceKey]) return app.metadata.labels[labelControllerNamespaceKey];
    else return app.metadata.namespace;
  }

  console.log("Argo CD Namespace is: " + ns);

  try {
    const [argoServerURL] = await k8sListItems<K8sResourceCommon>({
      model: model,
      queryParams: {
        ns: ns(),
        labelSelector: {
          matchLabels: {
            'app.kubernetes.io/part-of': 'argocd',
          },
        },
      },
    });
    // TODO - Don't hardcode this, determine from route
    info.protocol = "https";
    if (argoServerURL) {
      info.host = argoServerURL["spec"]["host"]
    } else {
      info.host = "argocd-server-" + ns() + location.host.substring(location.host.indexOf(".apps"))
    }

    console.log("Argo Server is: " + argoServerURL["spec"]["host"]);
    return info;
  } catch (e) {
    console.warn('Error while fetching Argo CD Server url:', e);
    return info;
  }
};