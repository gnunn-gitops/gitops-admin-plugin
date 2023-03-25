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