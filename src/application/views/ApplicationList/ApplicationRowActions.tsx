import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, applicationModelRef } from '@application-model';
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
import { AnnotationsModal } from '../modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '../modals/LabelsModal/LabelsModal';
import TabModal from '../modals/TabModal/TabModal';

type ApplicationRowActionsProps = {
  obj?: ApplicationKind;
};

const ApplicationRowActions: React.FC<ApplicationRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onDelete = React.useCallback(() => {
    return k8sDelete({
      model: ApplicationModel,
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
      <TabModal<ApplicationKind>
        onClose={onClose}
        isOpen={isOpen}
        obj={obj}
        onSubmit={onDelete}
        headerText={'Delete Application?'}
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
