import * as React from 'react';
import { Alert, Button, Modal, ModalVariant, Text } from '@patternfly/react-core';
import * as _ from 'lodash';
import { K8sResourceCommon, getGroupVersionKindForResource, k8sDelete, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { useNavigate } from 'react-router-dom-v5-compat';
import { useLastNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { getResourceUrl } from '@gitops-utils/utils';

type ResourceDeleteModalProps = {
    isOpen: boolean;
    resource: K8sResourceCommon;
    onClose: () => void;
    btnText?: string;
    shouldRedirect?: boolean;
  };

const ResourceDeleteModal = (props: ResourceDeleteModalProps) => {
  const { resource, btnText, shouldRedirect, isOpen, onClose } = props;
  const [error, setError] = React.useState<string>(null);

  const [isChecked, setIsChecked] = React.useState(true);

  const [model] = useK8sModel(getGroupVersionKindForResource(resource));

  const [lastNamespace] = useLastNamespace();
  const navigate = useNavigate();
  const { t } = useGitOpsTranslation();

  const submit = (event) => {
    event.preventDefault();
    const propagationPolicy = isChecked && model ? null : 'Orphan';

    const json = propagationPolicy
      ? { kind: 'DeleteOptions', apiVersion: 'v1', propagationPolicy }
      : null;

    k8sDelete({ model, resource, json })
      .then(() => {
        const url = getResourceUrl({ model, activeNamespace: lastNamespace });
        onClose();
        shouldRedirect && navigate(url);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Modal
      variant={ModalVariant.small}
      position="top"
      className="ocs-modal"
      title={`Delete ${model.kind}?`}
      isOpen={isOpen}
      onClose={onClose}
      titleIconVariant={"warning"}

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

export default ResourceDeleteModal;
