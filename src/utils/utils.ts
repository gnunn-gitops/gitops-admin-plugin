import { K8sResourceCommon, K8sVerb, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

const modelToRef = (obj: K8sModel) => `${obj.apiGroup}~${obj.apiVersion}~${obj.kind}`;
const modelToGroupVersionKind = (obj: K8sModel) => ({
  version: obj.apiVersion,
  kind: obj.kind,
  group: obj.apiGroup,
});

export { modelToGroupVersionKind, modelToRef };

export function getObjectModifyPermissions(obj: K8sResourceCommon, model: K8sModel): [[boolean, boolean], [boolean, boolean], [boolean,boolean]] {

  const canPatch = useAccessReview({
    group: model.apiGroup,
    verb: 'patch' as K8sVerb,
    resource: model.plural,
    name: obj.metadata.name,
    namespace: obj.metadata.namespace,
  });

  const canUpdate = useAccessReview({
    group: model.apiGroup,
    verb: 'update' as K8sVerb,
    resource: model.plural,
    name: obj.metadata.name,
    namespace: obj.metadata.namespace,
  });

  const canDelete = useAccessReview({
    group: model.apiGroup,
    verb: 'delete' as K8sVerb,
    resource: model.plural,
    name: obj.metadata.name,
    namespace: obj.metadata.namespace,
  });

  return [canPatch, canUpdate, canDelete];
}
