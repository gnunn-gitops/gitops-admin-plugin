import { k8sGet, SetFeatureFlag, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { useEffect, useState } from 'react';

const CERTIFICATE_REQUESTS_FLAG = "CERTIFICATE_REQUEST";

export const useCertificateRequestsProvider = (setFeatureFlag: SetFeatureFlag) => {
    setFeatureFlag(CERTIFICATE_REQUESTS_FLAG, useCertificateRequestsAvailable());
};

const useCertificateRequestsAvailable = () => {
    const [crAvailable, setCRAvailable] = useState(false);
    const [model] = useK8sModel({ group: "apiextensions.k8s.io", version: "v1", kind: "CustomResourceDefinition" });

    useEffect(() => {
        k8sGet({
            model: model,
            name: "certificaterequests.cert-manager.io",
        }).then((object) => {
            setCRAvailable(object != null)
        });

    });

    return crAvailable;
  };
