import { modelToRef } from "@gitops-utils/utils";
import { K8sModel, K8sResourceCommon, K8sResourceCondition } from "@openshift-console/dynamic-plugin-sdk";

export const ExternalSecretModel: K8sModel = {
    label: 'ExternalSecret',
    labelPlural: 'ExternalSecrets',
    apiVersion: 'v1beta1',
    apiGroup: 'external-secrets.io',
    plural: 'externalsecrets',
    abbr: 'es',
    namespaced: true,
    kind: 'ExternalSecret',
    id: 'externalsecret',
    crd: true,
    propagationPolicy: 'Background'
  };

export type ExternalSecretSpec = {
    refreshInterval?: string
    secretStoreRef?: {
        kind?: string
        name: string
    }
    target?: {
        creationPolicy?: string
        deletionPolicy?: string
        immutable?: boolean
        name?: string
        template?: Object
    }
}

export type ExternalSecretStatus = {
    binding? : {
        name: string
    }
    conditions?: K8sResourceCondition[]
    refreshTime?: string
    synchedResourceVersion?: string
}

export type ExternalSecretKind = K8sResourceCommon & {
    spec?: ExternalSecretSpec
    status?: ExternalSecretStatus
};

export const externalSecretModelRef = modelToRef(ExternalSecretModel);
