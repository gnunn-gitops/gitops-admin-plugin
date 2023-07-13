import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { RolloutKind } from "@rollout-model/RolloutModel";

const annotationRevisionKey="rollout.argoproj.io/revision";
const labelPodTemplateHashKey="rollouts-pod-template-hash";

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

export type ReplicaSetInfo = {
    revision: number,
    name: string,
    namespace: string,
    statuses: ReplicaSetStatus[],
    images: ImageInfo[]
}

function getReplicaSetStatus(rollout: RolloutKind, replicaSet: K8sResourceCommon): ReplicaSetStatus[] {
    const statuses:ReplicaSetStatus[] = [];
    const podTemplateHash:string = replicaSet.metadata?.labels[labelPodTemplateHashKey];
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
    const images:ImageInfo[] = [];
    replicaSet.spec.template?.spec?.containers?.forEach(container => {
        images.push({name: container.name, image: container.image})
    });
    return images;
}

export const getReplicaSetInfo = (rollout: RolloutKind, replicaSets:K8sResourceCommon[]): ReplicaSetInfo[] => {
    const result:ReplicaSetInfo[] = [];

    replicaSets.forEach(item => {
        result.push({
            name: item.metadata.name,
            namespace: item.metadata.namespace,
            revision: +item.metadata.annotations[annotationRevisionKey],
            statuses: getReplicaSetStatus(rollout, item),
            images: getImages(item)
        });
    })
    return result;
}
