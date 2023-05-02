import * as React from 'react';
import { useHistory } from 'react-router-dom';

import {
  getGroupVersionKindForResource,
  K8sModel,
  K8sResourceCommon,
} from '@openshift-console/dynamic-plugin-sdk';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { useLastNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import { ButtonVariant } from '@patternfly/react-core';

import ConfirmActionMessage from '../../../../application/views/components/ConfirmActionMessage/ConfirmActionMessage';
import TabModal from '../TabModal/TabModal';

type DeleteModalProps = {
  isOpen: boolean;
  obj: K8sResourceCommon;
  onDeleteSubmit: () => Promise<void | K8sResourceCommon>;
  onClose: () => void;
  headerText?: string;
};

const DeleteModal: React.FC<DeleteModalProps> = React.memo(
  ({ isOpen, obj, onDeleteSubmit, onClose, headerText }) => {
    const t = (key: string) => key;
    const history = useHistory();

    const [model] = useK8sModel(getGroupVersionKindForResource(obj));
    const [lastNamespace] = useLastNamespace();
    const url = getResourceUrl({ model, activeNamespace: lastNamespace });
    return (
      <TabModal<K8sResourceCommon>
        obj={obj}
        headerText={headerText || t('Delete Resource?')}
        onSubmit={() => {
          return onDeleteSubmit().then(() => {
            history.push(url);
          });
        }}
        isOpen={isOpen}
        onClose={onClose}
        submitBtnText={t('Delete')}
        submitBtnVariant={ButtonVariant.danger}
        titleIconVariant={'warning'}
      >
        <ConfirmActionMessage obj={obj} />
      </TabModal>
    );
  },
);

export default DeleteModal;

type ResourceUrlProps = {
  model: K8sModel;
  resource?: K8sResourceCommon;
  activeNamespace?: string;
};

export const ALL_NAMESPACES_SESSION_KEY = '#ALL_NS#';

/**
 * function for getting a resource URL
 * @param {ResourceUrlProps} urlProps - object with model, resource to get the URL from (optional) and active namespace/project name (optional)
 * @returns {string} the URL for the resource
 */
export const getResourceUrl = (urlProps: ResourceUrlProps): string => {
  const { model, resource, activeNamespace } = urlProps;

  if (!model) return null;
  const { crd, namespaced, plural } = model;

  const namespace =
    resource?.metadata?.namespace ||
    (activeNamespace !== ALL_NAMESPACES_SESSION_KEY && activeNamespace);
  const namespaceUrl = namespace ? `ns/${namespace}` : 'all-namespaces';

  const ref = crd ? `${model.apiGroup || 'core'}~${model.apiVersion}~${model.kind}` : plural || '';
  const name = resource?.metadata?.name || '';

  return `/k8s/${namespaced ? namespaceUrl : 'cluster'}/${ref}/${name}`;
};
