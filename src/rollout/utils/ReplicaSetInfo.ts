import { K8sResourceCommon, Operator, Selector } from "@openshift-console/dynamic-plugin-sdk";
import { AnalysisRunKind } from "@rollout-model/AnalysisRunModel";
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

    return {
        matchExpressions: [
            {
                key: labelPodTemplateHashKey,
                operator: Operator.In,
                values: podTemplateHash
            }
        ]
    }
}

export const getReplicaSetInfo = async (rollout: RolloutKind, replicaSets: any[], analysisRuns: AnalysisRunKind[]): Promise<ReplicaSetInfo[]> => {
    const result: ReplicaSetInfo[] = [];

    if (!replicaSets || !rollout) return result;
    if (!rollout.metadata || !Array.isArray(replicaSets)) return result;

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
        console.log("Creating revision " + revision);

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
            console.log("Creating " + revision + " not found, pushing new one");
            const rsInfo: ReplicaSetInfo = {
                name: undefined,
                namespace: ar.metadata.namespace,
                revision: +revision,
                statuses: [],
                images: [],
                pods: undefined,
                podTemplateHash: podTemplateHash,
                analysisRuns: getAnalysisRunInfo(analysisRuns, podTemplateHash, revision)
            }
            result.push(rsInfo);
            // Add the revision to revisions as string constrant so we do not add duplicate entries
            revisions[revision] = "no-replica-set";
        }
    });
    console.log("ReplicaSetInfo");
    console.log(result);
    return result;
}
