import { K8sResourceCommon, K8sVerb, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

const modelToRef = (obj: K8sModel) => `${obj.apiGroup}~${obj.apiVersion}~${obj.kind}`;
const modelToGroupVersionKind = (obj: K8sModel) => ({
  version: obj.apiVersion,
  kind: obj.kind,
  group: obj.apiGroup,
});

export { modelToGroupVersionKind, modelToRef };

export type ResourceUrlProps = {
  model: K8sModel;
  resource?: K8sResourceCommon;
  activeNamespace?: string;
  name?: string;
};

export const ALL_NAMESPACES_SESSION_KEY = '#ALL_NS#';

/**
* function for getting a resource URL
* @param {ResourceUrlProps} urlProps - object with model, resource to get the URL from (optional) and active namespace/project name (optional)
* @returns {string} the URL for the resource
*/
export const getResourceUrl = (urlProps: ResourceUrlProps): string => {
const { model, resource, activeNamespace, name } = urlProps;

if (!model) return null;
const { crd, namespaced, plural } = model;

const namespace =
  resource?.metadata?.namespace ||
  (activeNamespace !== ALL_NAMESPACES_SESSION_KEY && activeNamespace);
const namespaceUrl = namespace ? `ns/${namespace}` : 'all-namespaces';

const ref = crd ? `${model.apiGroup || 'core'}~${model.apiVersion}~${model.kind}` : plural || '';
const resourceName = resource?.metadata?.name || name;

return `/k8s/${namespaced ? namespaceUrl : 'cluster'}/${ref}/${resourceName}`;
};

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
