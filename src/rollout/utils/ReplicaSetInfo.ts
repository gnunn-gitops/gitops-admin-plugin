import { K8sResourceCommon, Selector, k8sList } from "@openshift-console/dynamic-plugin-sdk";
import { AnalysisRunKind, AnalysisRunModel } from "@rollout-model/AnalysisRunModel";
import { RolloutKind } from "@rollout-model/RolloutModel";

const annotationRevisionKey = "rollout.argoproj.io/revision";
const labelPodTemplateHashKey = "rollouts-pod-template-hash";

export enum ReplicaSetStatus {
    Active,
    Canary,
    Preview,
    Stable
}

export type ImageInfo = {
    name: string,
    image: string
}

export type AnalysisRunInfo = {
    name: string,
    shortName: string,
    status: string,
    startedAt: string,
    analysisRun: AnalysisRunKind
}

export type PodInfo = {
    readyReplicas: number,
    replicas: number
}

export type ReplicaSetInfo = {
    revision: number,
    name: string,
    namespace: string,
    statuses: ReplicaSetStatus[],
    images: ImageInfo[],
    pods: PodInfo,
    podTemplateHash: string,
    analysisRuns: AnalysisRunInfo[],
    replicaSet?: K8sResourceCommon
}

function getReplicaSetStatus(rollout: RolloutKind, replicaSet: K8sResourceCommon): ReplicaSetStatus[] {
    const statuses: ReplicaSetStatus[] = [];
    const podTemplateHash: string = replicaSet.metadata?.labels[labelPodTemplateHashKey];
    if (rollout.spec.strategy.blueGreen) {
        if (rollout.status?.stableRS == podTemplateHash) statuses.push(ReplicaSetStatus.Stable);
        if (rollout.status?.blueGreen?.activeSelector == podTemplateHash) {
            statuses.push(ReplicaSetStatus.Active);
        } else if (rollout.status?.blueGreen?.previewSelector == podTemplateHash) {
            statuses.push(ReplicaSetStatus.Preview)
        }
    }
    if (rollout.spec.strategy.canary) {
        if (rollout.status?.stableRS == podTemplateHash) statuses.push(ReplicaSetStatus.Stable);
        if (rollout.status?.currentPodHash == podTemplateHash) statuses.push(ReplicaSetStatus.Canary);
    }
    return statuses;
}

function getImages(replicaSet: any): ImageInfo[] {
    const images: ImageInfo[] = [];
    replicaSet.spec.template?.spec?.containers?.forEach(container => {
        images.push({ name: container.name, image: container.image })
    });
    return images;
}

function getAnalysisRunInfo(analysisRuns: AnalysisRunKind[], podTemplateHash: string, revision: string): AnalysisRunInfo[] {
    const info: AnalysisRunInfo[] = [];
    analysisRuns.forEach((ar) => {
        if (ar.metadata.labels[labelPodTemplateHashKey] == podTemplateHash && ar.metadata.annotations[annotationRevisionKey] == revision) {
            const name = ar.metadata.name.split("-");
            const shortName = name[name.length - 2] + "-" + name[name.length - 1]
            info.push(
                {
                    name: ar.metadata.name,
                    shortName: shortName,
                    status: ar.status.phase,
                    startedAt: ar.status.startedAt,
                    analysisRun: ar
                }
            );
        }
    });
    return info.sort((a,b) => a.startedAt > b.startedAt? 1:-1)
}

export function getAnalysisRunSelector(replicaSets: K8sResourceCommon[]):Selector {
    const podTemplateHash: string[] = [];

    replicaSets.forEach((rs) => {
        const value: string = rs.metadata.labels[labelPodTemplateHashKey];
        if (value) podTemplateHash.push(value);
    });

    const selector: Selector = {
        matchExpressions: [
            {
                key: labelPodTemplateHashKey,
                operator: "in",
                values: podTemplateHash
            }
        ]
    }
    return selector;
}

export const getReplicaSetInfo = async (rollout: RolloutKind, replicaSets: any[]): Promise<ReplicaSetInfo[]> => {
    const result: ReplicaSetInfo[] = [];
    console.log(rollout);
    console.log(replicaSets);

    if (!replicaSets || !rollout) return result;
    if (!rollout.metadata || !Array.isArray(replicaSets)) return result;

    // const selector: Selector = getAnalysisRunSelector(replicaSets);

    // Note I don't think we need to watch analysisRuns since everytime a replicaset is generated
    // the analysis run should. Ideally the analysisrun would be labelled with the rollout
    // so we could just use a selector but unfortunately that's not the case. while the AR has
    // the owner as the rollout there is no way to select based on that. So instead we build up
    // the set of pod-templates and then do an "in" selection.
    //
    // TODO - See if this can be made more efficient, use Memo?
    const analysisRuns:AnalysisRunKind[] = await k8sList<AnalysisRunKind>({
        model: AnalysisRunModel,
        queryParams: {
            ns: rollout.metadata.namespace,
            labelSelector: getAnalysisRunSelector(replicaSets)
        },
    }) as AnalysisRunKind[];

    // Used to track revisions which we need when hunting for orphan analysisruns (i.e. ones that don't have a ReplicaSet)
    type RevisionsMap = {
        [revision: string]: any;
    }

    const revisions: RevisionsMap = [];

    // Go through each replicaset and add to list
    replicaSets.forEach(rs => {

        const podTemplateHash: string = rs.metadata.labels[labelPodTemplateHashKey];
        const revision: string = rs.metadata.annotations[annotationRevisionKey];

        revisions[revision] = rs;

        result.push({
            name: rs.metadata.name,
            namespace: rs.metadata.namespace,
            revision: +revision,
            statuses: getReplicaSetStatus(rollout, rs),
            images: getImages(rs),
            pods: { readyReplicas: rs.status?.readyReplicas, replicas: rs.status?.replicas },
            podTemplateHash: podTemplateHash,
            analysisRuns: getAnalysisRunInfo(analysisRuns, podTemplateHash, revision),
            replicaSet: rs
        });
    })

    // It's possible that there are orphan AnaylsisRuns that don't have a ReplicaSet so to run through
    // them as well
    analysisRuns.forEach(ar => {

        const revision: string = ar.metadata.annotations[annotationRevisionKey];
        const podTemplateHash: string = ar.metadata.labels[labelPodTemplateHashKey];

        if (!revisions[revision]) {
            result.push({
                name: undefined,
                namespace: ar.metadata.namespace,
                revision: +revision,
                statuses: [],
                images: [],
                pods: undefined,
                podTemplateHash: podTemplateHash,
                analysisRuns: getAnalysisRunInfo(analysisRuns, podTemplateHash, revision)
            });
            // Add the revision has marked so we don't add duplicate entries
            revisions[revision] = undefined;
        }
    });
    return result;
}
