import { modelToRef } from "@gitops-utils/utils";
import { K8sModel, K8sResourceCommon, K8sResourceCondition } from "@openshift-console/dynamic-plugin-sdk";

export const CertificateRequestModel: K8sModel = {
    label: 'CertificateRequest',
    labelPlural: 'CertificateRequests',
    apiVersion: 'v1',
    apiGroup: 'cert-manager.io',
    plural: 'certificaterequests',
    abbr: 'cr',
    namespaced: true,
    kind: 'CertificateRequest',
    id: 'certificaterequest',
    crd: true,
    propagationPolicy: 'Background'
  };



export type CertificateRequestStatus = {
    binding? : {
        name: string
    }
    conditions?: K8sResourceCondition[]
    refreshTime?: string
    synchedResourceVersion?: string
}

export type CertificateRequestKind = K8sResourceCommon & {
    status?: CertificateRequestStatus
};

export const certificateRequestModelRef = modelToRef(CertificateRequestModel);
