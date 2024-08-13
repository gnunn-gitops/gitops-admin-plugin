import { k8sGet, SetFeatureFlag, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { useEffect, useState } from 'react';

const GITOPS_ADMIN_FLAG = "GITOPS_ADMIN";

export const useGitOpsProvider = (setFeatureFlag: SetFeatureFlag) => {
    setFeatureFlag(GITOPS_ADMIN_FLAG, useGitOpsAvailable());
};

const useGitOpsAvailable = () => {
    const [gitopsAvailable, setGitOpsAvailable] = useState(false);
    const [model] = useK8sModel({ group: "apiextensions.k8s.io", version: "v1", kind: "CustomResourceDefinition" });

    useEffect(() => {
        k8sGet({
            model: model,
            name: "argocds.argoproj.io",
        }).then((object) => {
            setGitOpsAvailable(object != null)
        });

    });

    return gitopsAvailable;
  };
