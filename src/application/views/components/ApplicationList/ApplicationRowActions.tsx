import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, OperationState, applicationModelRef } from '@application-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE, PhaseStatus } from '@gitops-utils/constants';
import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';

import { AnnotationsModal } from '../../../../shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '../../../../shared/views/modals/LabelsModal/LabelsModal';
import { refreshAppk8s, syncAppK8s, terminateOpK8s } from 'src/services/argocd';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import { getAppOperationState } from '@gitops-utils/gitops';

type ApplicationRowActionsProps = {
  obj?: ApplicationKind;
};

const ApplicationRowActions: React.FC<ApplicationRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const { t } = useGitOpsTranslation();

  const [canPatch, canUpdate, canDelete] = getObjectModifyPermissions(obj, ApplicationModel);

  const onEditLabelsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: ApplicationModel,
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
            model: ApplicationModel,
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

  const onEditApplication = () => {
    const cta = {
      href: `/k8s/ns/${obj.metadata.namespace || DEFAULT_NAMESPACE}/${applicationModelRef}/${obj.metadata.name
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

  const onSyncApplication = () => {
    syncAppK8s(obj);
  };

  const onTerminateApplication = () => {
    terminateOpK8s(obj);
  };

  const onRefreshApplication = () => {
    refreshAppk8s(obj, false);
  };

  const onRefreshHardApplication = () => {
    refreshAppk8s(obj, true);
  };

  const state: OperationState = getAppOperationState(obj);

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onSyncApplication} key="application-sync" isDisabled={!canPatch || (obj && obj.status?.operationState?.phase && (obj.status?.operationState?.phase == PhaseStatus.TERMINATING || obj.status?.operationState?.phase == PhaseStatus.RUNNING))}>
          {t('Sync')}
        </DropdownItem>,
        <DropdownItem onClick={onTerminateApplication} key="application-stop" isDisabled={!canPatch || (obj && state && state.phase != PhaseStatus.RUNNING) }>
        {t('Stop')}
        </DropdownItem>,
        <DropdownItem onClick={onRefreshApplication} key="application-refresh" isDisabled={!canPatch}>
          {t('Refresh')}
        </DropdownItem>,
        <DropdownItem onClick={onRefreshHardApplication} key="application-refresh-hard" isDisabled={!canPatch}>
          {t('Refresh (Hard)')}
        </DropdownItem>,
        <DropdownItem onClick={onEditLabelsModalToggle} key="application-edit-labels" isDisabled={!canPatch}>
          {t('Edit labels')}
        </DropdownItem>,
        <DropdownItem onClick={onEditAnnotationsModalToggle} key="application-edit annotations" isDisabled={!canPatch}>
          {t('Edit annotations')}
        </DropdownItem>,
        <DropdownItem onClick={onEditApplication} key="application-edit" isDisabled={!canUpdate}>
          {t('Edit Application')}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="application-delete" isDisabled={!canDelete}>
          {t('Delete Application')}
        </DropdownItem>
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ApplicationRowActions;
