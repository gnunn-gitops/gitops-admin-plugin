import { modelToRef } from "@gitops-utils/utils";
import { K8sModel, K8sResourceCommon, K8sResourceCondition } from "@openshift-console/dynamic-plugin-sdk";

export const CertificateModel: K8sModel = {
    label: 'Certificate',
    labelPlural: 'Certificates',
    apiVersion: 'v1',
    apiGroup: 'cert-manager.io',
    plural: 'certificates',
    abbr: 'cert',
    namespaced: true,
    kind: 'Certificate',
    id: 'certificate',
    crd: true,
    propagationPolicy: 'Background'
  };


export type CertificateStatus = {
    binding? : {
        name: string
    }
    conditions?: K8sResourceCondition[]
    refreshTime?: string
    synchedResourceVersion?: string
}

export type CertificateKind = K8sResourceCommon & {
    status?: CertificateStatus
};

export const certificateModelRef = modelToRef(CertificateModel);
