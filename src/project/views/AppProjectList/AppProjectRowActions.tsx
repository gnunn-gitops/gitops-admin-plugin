import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { AppProjectKind, AppProjectModel, appProjectModelRef } from '@appproject-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { k8sDelete, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import {
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';

import ConfirmActionMessage from '../components/ConfirmActionMessage/ConfirmActionMessage';
import { AnnotationsModal } from '@shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import TabModal from '@shared/views/modals/TabModal/TabModal';

type AppProjectRowActionsProps = {
  obj?: AppProjectKind;
};

const AppProjectRowActions: React.FC<AppProjectRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onDelete = React.useCallback(() => {
    return k8sDelete({
      model: AppProjectModel,
      resource: obj,
    }).catch(console.error);
  }, [obj]);

  const onEditLabelsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: AppProjectModel,
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
            model: AppProjectModel,
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

  const onEditAppProject = () => {
    const cta = {
      href: `/k8s/ns/${obj.metadata.namespace || DEFAULT_NAMESPACE}/${appProjectModelRef}/${
        obj.metadata.name
      }/yaml`,
    };
    history.push(cta.href);
  };

  const onDeleteModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <TabModal<AppProjectKind>
        onClose={onClose}
        isOpen={isOpen}
        obj={obj}
        onSubmit={onDelete}
        headerText={'Delete Project?'}
        submitBtnText={'Delete'}
        submitBtnVariant={ButtonVariant.danger}
      >
        <ConfirmActionMessage obj={obj} action="delete" />
      </TabModal>
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
        <DropdownItem onClick={onEditLabelsModalToggle} key="appproject-delete">
          {'Edit labels'}
        </DropdownItem>,
        <DropdownItem onClick={onEditAnnotationsModalToggle} key="appproject-delete">
          {'Edit annotations'}
        </DropdownItem>,
        <DropdownItem onClick={onEditAppProject} key="appproject-delete">
          {'Edit Project'}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="appproject-delete">
          {'Delete Project'}
        </DropdownItem>,
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default AppProjectRowActions;
