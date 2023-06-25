import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, applicationModelRef } from '@application-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { k8sDelete, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';

import { AnnotationsModal } from '../../../../shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '../../../../shared/views/modals/LabelsModal/LabelsModal';
import { refreshApp, syncApp } from 'src/services/argocd';
import DeleteModal from '@shared/views/modals/DeleteModal/DeleteModal';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ApplicationRowActionsProps = {
  obj?: ApplicationKind;
};

const ApplicationRowActions: React.FC<ApplicationRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const { t } = useGitOpsTranslation();

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
      href: `/k8s/ns/${obj.metadata.namespace || DEFAULT_NAMESPACE}/${applicationModelRef}/${
        obj.metadata.name
      }/yaml`,
    };
    history.push(cta.href);
  };

  const onDeleteModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <DeleteModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        headerText={t('Delete Application?')}
        onDeleteSubmit={() =>
          k8sDelete({
            model: ApplicationModel,
            resource: obj,
          })
        }
      />
    ));
  };

  const onSyncApplication = () => {
    syncApp(obj);
  };

  const onRefreshApplication = () => {
    refreshApp(obj, false);
  };

  const onRefreshHardApplication = () => {
    refreshApp(obj, true);
  };

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onSyncApplication} key="application-sync">
          {'Sync'}
        </DropdownItem>,
        <DropdownItem onClick={onRefreshApplication} key="application-refresh">
          {'Refresh'}
        </DropdownItem>,
        <DropdownItem onClick={onRefreshHardApplication} key="application-refresh-hard">
          {'Refresh (Hard)'}
        </DropdownItem>,
        <DropdownItem onClick={onEditLabelsModalToggle} key="application-delete">
          {'Edit labels'}
        </DropdownItem>,
        <DropdownItem onClick={onEditAnnotationsModalToggle} key="application-delete">
          {'Edit annotations'}
        </DropdownItem>,
        <DropdownItem onClick={onEditApplication} key="application-delete">
          {'Edit Application'}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="application-delete">
          {'Delete Application'}
        </DropdownItem>,
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ApplicationRowActions;
