import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';

import { AnnotationsModal } from '@shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import { RolloutKind, RolloutModel, rolloutModelRef } from 'src/rollout/models/RolloutModel';
import { abortRollout, promoteRollout, retryRollout } from 'src/services/argocd';
import { RolloutStatus, isDeploying } from 'src/rollout/utils/rollout-utils';

type RolloutRowActionsProps = {
  obj?: RolloutKind;
};

const RolloutRowActions: React.FC<RolloutRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const [canPatch, canUpdate, canDelete] = getObjectModifyPermissions(obj, RolloutModel);

  const { t } = useGitOpsTranslation();

  const onEditLabelsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: RolloutModel,
            resource: obj,
            data: [
              {
                op: 'replace',
                path: '/metadata/labels',
                value: labels,
              },
            ],
          })
        }
      />
    ));
  };

  const onEditAnnotationsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <AnnotationsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(updatedAnnotations) =>
          k8sPatch({
            model: RolloutModel,
            resource: obj,
            data: [
              {
                op: 'replace',
                path: '/metadata/annotations',
                value: updatedAnnotations,
              },
            ],
          })
        }
      />
    ));
  };

  const onPromote = () => {
    promoteRollout(obj, false);
  };

  const onFullPromote = () => {
    promoteRollout(obj, true);
  };

  const onRestart = () => {
    promoteRollout(obj, true);
  };

  const onAbort = () => {
    abortRollout(obj);
  };

  const onRetry = () => {
    retryRollout(obj);
  };

  const onEditRollout = () => {
    const cta = {
      href: `/k8s/ns/${obj.metadata.namespace || DEFAULT_NAMESPACE}/${rolloutModelRef}/${
        obj.metadata.name
      }/yaml`,
    };
    history.push(cta.href);
  };

  const onDeleteModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <ResourceDeleteModal
        resource={obj}
        isOpen={isOpen}
        onClose={onClose}
      />
    ));
  };

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onPromote} key="rollout-promote" isDisabled={!canPatch || !isDeploying(obj)}>
          {t('Promote')}
        </DropdownItem>,
        <DropdownItem onClick={onFullPromote} key="rollout-full-promote" isDisabled={!canPatch || !isDeploying(obj)}>
        {t('Full Promote')}
        </DropdownItem>,
        <DropdownItem onClick={onAbort} key="rollout-abort" isDisabled={!canPatch || !isDeploying(obj)}>
        {t('Abort')}
        </DropdownItem>,
        <DropdownItem onClick={onRetry} key="rollout-retry" isDisabled={!canPatch || obj.status?.phase !== RolloutStatus.Degraded}>
        {t('Retry')}
        </DropdownItem>,
        <DropdownItem onClick={onRestart} key="rollout-restart" isDisabled={!canPatch}>
        {t('Restart')}
        </DropdownItem>,
        <DropdownItem onClick={onEditLabelsModalToggle} key="rollout-edit-labels" isDisabled={!canPatch}>
          {t('Edit labels')}
        </DropdownItem>,
        <DropdownItem onClick={onEditAnnotationsModalToggle} key="rollout-edit-annotations" isDisabled={!canPatch}>
          {t('Edit annotations')}
        </DropdownItem>,
        <DropdownItem onClick={onEditRollout} key="rollout-edit" isDisabled={!canUpdate}>
          {t('Edit Rollout')}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="rollout-delete" isDisabled={!canDelete}>
          {t('Delete Rollout')}
        </DropdownItem>,
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default RolloutRowActions;