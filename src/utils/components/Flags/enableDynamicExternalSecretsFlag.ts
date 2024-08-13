import { k8sGet, SetFeatureFlag, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { useEffect, useState } from 'react';

const EXTERNAL_SECRETS_FLAG = "EXTERNAL_SECRET";

export const useExternalSecretsProvider = (setFeatureFlag: SetFeatureFlag) => {
    setFeatureFlag(EXTERNAL_SECRETS_FLAG, useExternalSecretsAvailable());
};

const useExternalSecretsAvailable = () => {
    const [esAvailable, setESAvailable] = useState(false);
    const [model] = useK8sModel({ group: "apiextensions.k8s.io", version: "v1", kind: "CustomResourceDefinition" });

    useEffect(() => {
        k8sGet({
            model: model,
            name: "externalsecrets.external-secrets.io",
        }).then((object) => {
            setESAvailable(object != null)
        });

    });

    return esAvailable;
  };
