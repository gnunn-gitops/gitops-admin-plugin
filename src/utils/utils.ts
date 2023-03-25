import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

const modelToRef = (obj: K8sModel) => `${obj.apiGroup}~${obj.apiVersion}~${obj.kind}`;
const modelToGroupVersionKind = (obj: K8sModel) => ({
  version: obj.apiVersion,
  kind: obj.kind,
  group: obj.apiGroup,
});

export { modelToGroupVersionKind, modelToRef };
