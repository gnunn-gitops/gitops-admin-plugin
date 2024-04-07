import { modelToRef } from "@gitops-utils/utils";
import { K8sModel, K8sResourceCommon, Selector } from "@openshift-console/dynamic-plugin-sdk";

export const RolloutModel: K8sModel = {
    label: 'Rollout',
    labelPlural: 'Rollouts',
    apiVersion: 'v1alpha1',
    apiGroup: 'argoproj.io',
    plural: 'rollouts',
    abbr: 'ro',
    namespaced: true,
    kind: 'Rollout',
    id: 'rollout',
    crd: true,
};

export type RolloutStrategyBlueGreen = {
    activeService: string,
    previewService: string,
    autoPromotionEnabled: boolean
}

export type RolloutStrategyCanary = {
    canaryService: string,
    stableService: string,
    autoPromotionEnabled: boolean
}

export type RolloutSpec = {
    replicas?: number,
    revisionHistoryLimit?: number,
    selector?: Selector,
    strategy: {
      blueGreen?: RolloutStrategyBlueGreen,
      canary?: RolloutStrategyCanary
    }
}

export type AnalysisRunStatus = {
    message?: string,
    name: string,
    status: string
}

export type PauseConditions = {
    reason: string,
    startTime: string
}

export type RolloutStatus = {
    blueGreen?: {
        activeSelector?: string,
        previewSelector?: string,
        postPromotionAnalysisRunStatus?: AnalysisRunStatus,
        prePromotionAnalysisRunStatus?: AnalysisRunStatus
    }
    controllerPause?: boolean,
    currentPodHash?: string,
    currentStepHash?: string,
    currentStepIndex?: number,
    message?: string,
    observedGeneration?: string,
    pauseConditions? : PauseConditions[],
    phase?: string,
    promoteFull: boolean,
    readyReplicas?: number,
    replicas?: number,
    selector?: string,
    stableRS?: string,
    updatedReplicas?: number
}

export type RolloutKind = K8sResourceCommon & {
    spec?: RolloutSpec,
    status?: RolloutStatus
};

export const rolloutModelRef = modelToRef(RolloutModel);
