import { k8sGet, SetFeatureFlag, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { useEffect, useState } from 'react';

const CERTIFICATES_FLAG = "CERTIFICATE";

export const useCertificatesProvider = (setFeatureFlag: SetFeatureFlag) => {
    setFeatureFlag(CERTIFICATES_FLAG, useCertificatesAvailable());
};

const useCertificatesAvailable = () => {
    const [certAvailable, setCertAvailable] = useState(false);
    const [model] = useK8sModel({ group: "apiextensions.k8s.io", version: "v1", kind: "CustomResourceDefinition" });

    useEffect(() => {
        k8sGet({
            model: model,
            name: "certificates.cert-manager.io",
        }).then((object) => {
            setCertAvailable(object != null)
        });

    });

    return certAvailable;
  };
