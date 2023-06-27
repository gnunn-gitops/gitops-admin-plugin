import * as React from 'react';
import { Alert, Button, Modal, ModalVariant, Text } from '@patternfly/react-core';
import * as _ from 'lodash';
import { K8sModel, K8sResourceCommon, getGroupVersionKindForResource, k8sDelete, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { useHistory } from 'react-router';
import { useLastNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ResourceDeleteModalProps = {
    isOpen: boolean;
    resource: K8sResourceCommon;
    onClose: () => void;
    btnText?: string;
    pushHistory?: boolean;
  };

const ResourceDeleteModal = (props: ResourceDeleteModalProps) => {
  const { resource, btnText, pushHistory, isOpen, onClose } = props;
  const [error, setError] = React.useState<string>(null);

  const [isChecked, setIsChecked] = React.useState(true);

  const [model] = useK8sModel(getGroupVersionKindForResource(resource));

  const [lastNamespace] = useLastNamespace();
  const history = useHistory();
  const { t } = useGitOpsTranslation();

  const submit = (event) => {
    event.preventDefault();
    const propagationPolicy = isChecked && model ? model.propagationPolicy : 'Orphan';
    const json = propagationPolicy
      ? { kind: 'DeleteOptions', apiVersion: 'v1', propagationPolicy }
      : null;

    k8sDelete({ model, resource, json })
      .then(() => {
        const url = getResourceUrl({ model, activeNamespace: lastNamespace });

        onClose();
        if (pushHistory) history.push(url);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Modal
      variant={ModalVariant.small}
      className="ocs-modal"
      title={`Delete ${model.kind}?`}
      isOpen={isOpen}
      onClose={onClose}
      titleIconVariant="warning"
      actions={[
        <Button key="delete" variant="danger" onClick={submit}>
          {btnText || 'Delete'}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Text>
        Are you sure you want to delete{' '}
        <strong className="co-break-word">{ resource.metadata.name }</strong>?
      </Text>
      <div className="checkbox">
        <label className="control-label">
          <input
            type="checkbox"
            onChange={() => setIsChecked(!isChecked)}
            checked={!!isChecked}
          />
          {t('Delete dependent objects of this resource')}
        </label>
      </div>
      {error && (
        <Alert
          isInline
          className="co-alert co-alert--scrollable"
          variant="danger"
          title="public~An error occurred"
        >
          <div className="co-pre-line">{error}</div>
        </Alert>
      )}
    </Modal>
  );
};

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

export default ResourceDeleteModal;