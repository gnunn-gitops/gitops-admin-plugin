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

export const getArgoServerURL = async (model, namespace: string) => {


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
    return "https://" + argoServerURL["spec"]["host"];
  } catch (e) {
    console.warn('Error while fetching Argo CD Server url:', e);
    return '';
  }
};

const getSessionToken = () => {

  console.log("Document.cookie: " + document.cookie);

  const cookiePrefix = 'ee4d5f50aeaffc63a5a5fc30a3072a27=';
  return (
    document &&
    document.cookie &&
    document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((c) => c.startsWith(cookiePrefix))
      .map((c) => c.slice(cookiePrefix.length))
      .pop()
  );
};

export const sync = async (app: ApplicationKind) => {

  var sessionToken = getSessionToken();

  console.log("token " + sessionToken);

  console.log("Synchronizing application " + app.metadata.name);


}