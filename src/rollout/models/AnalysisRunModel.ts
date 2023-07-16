import { modelToRef } from "@gitops-utils/utils";
import { K8sModel, K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

export const AnalysisRunModel: K8sModel = {
    label: 'AnalysisRun',
    labelPlural: 'AnalysisRuns',
    apiVersion: 'v1alpha1',
    apiGroup: 'argoproj.io',
    plural: 'analysisruns',
    abbr: 'ar',
    namespaced: true,
    kind: 'AnalysisRun',
    id: 'analysisrun',
    crd: true,
};

export type Measurements = {
    finishedAt?: string,
    message?: string,
    phase: string,
    resumeAt: string,
    startedAt: string,
    value: string
}

export type MetricResults = {
    consecutiveError?: number,
    count?: number,
    dryRun?: boolean,
    error?: number,
    failed?: number,
    inconclusive?: number,
    measurements?: Measurements[],
    message?: string,
    name: string,
    phase: string,
    successful?: number
}

export type AnaylsisRunStatus = {
    metricResults?: MetricResults,
    phase?: string,
    startedAt?: string
}

export type AnalysisRunKind = K8sResourceCommon & {
    status?: AnaylsisRunStatus
}

export const analysisRunModelRef = modelToRef(AnalysisRunModel);
