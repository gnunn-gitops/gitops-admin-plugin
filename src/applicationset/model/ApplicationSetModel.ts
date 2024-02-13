import { modelToRef } from '@gitops-utils/utils';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

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

export interface GitGenerator {
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

export type ApplicationSetSpec = {
    generators?: Object[]
}

export type ApplicationSetKind = K8sResourceCommon & {
    spec: ApplicationSetSpec;
};

export const applicationSetModelRef = modelToRef(ApplicationSetModel);
