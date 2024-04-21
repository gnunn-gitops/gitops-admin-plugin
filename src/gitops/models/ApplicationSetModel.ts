import { modelToRef } from '@gitops-utils/utils';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceCondition } from '@openshift-console/dynamic-plugin-sdk-internal/lib/extensions/console-types';
import { K8sModel, Selector } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const ApplicationSetModel: K8sModel = {
    label: 'ApplicationSet',
    labelPlural: 'ApplicationSets',
    apiVersion: 'v1alpha1',
    apiGroup: 'argoproj.io',
    plural: 'applicationsets',
    abbr: 'appset',
    namespaced: true,
    kind: 'ApplicationSet',
    id: 'applicationset',
    crd: true,
};

export type ListAppSetGenerator = {
    elements?: Object[]
    elementsYaml?: string
}

export type ClusterAppSetGenerator = {
    selector?: Selector,
    values?: Map<string, string>
}

export type GeneratorParent = {
    generators: AppSetGenerator[]
}

export type MatrixAppSetGenerator = GeneratorParent & {
}

export type UnionAppSetGenerator = GeneratorParent & {
}

export type MergeAppSetGenerator = GeneratorParent & {
    mergeKeys: string[]
}

export type GitAppSetGenerator = {
    repoURL: string,
    revision?: string,
    files?: {
        path: string
    }[],
    directories?: {
        exclude: boolean,
        path: string
    }[]
}

export type SCMProviderAppSetGenerator = {
    awsCodeCommit?: Object,
    azureDevOps?: Object,
    bitbucket?: Object,
    bitbucketServer?: Object,
    cloneProtocol?: string,
    filters?: Object[],
    gitea?: Object,
    github?: Object,
    gitlab?: Object,
    requeueAfterSeconds?: number,
    values?: Map<string, string>
}

export type PullRequestAppSetGenerator = {
    azuredevops?: Object,
    bitbucket?: Object,
    bitbucketServer?: Object,
    filters?: Object[],
    gitea?: Object,
    github?: Object,
    gitlab?: Object,
    requeueAfterSeconds?: number
}

export type ClusterDecisionresource = {
    configMapRef: string,
    labelSelector: Object,
    name: string,
    requeueAfterSeconds?: number
    values?: Map<string, string>
}

export type AppSetGenerator = {
    clusters?: ClusterAppSetGenerator
    git?: GitAppSetGenerator,
    list?: ListAppSetGenerator,
    matrix?: MatrixAppSetGenerator,
    merge?: MergeAppSetGenerator,
    pullRequest: PullRequestAppSetGenerator,
    scmProvider?: SCMProviderAppSetGenerator,
    union?: UnionAppSetGenerator
}

export type ApplicationSetSpec = GeneratorParent & {
}

export type ApplicationSetStatus = {
    conditions?: K8sResourceCondition[]
}

export type ApplicationSetKind = K8sResourceCommon & {
    spec: ApplicationSetSpec;
    status?: ApplicationSetStatus;
};

export const applicationSetModelRef = modelToRef(ApplicationSetModel);
