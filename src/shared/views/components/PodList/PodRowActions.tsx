import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { k8sPatch, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
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
import { getObjectModifyPermissions, modelToRef } from '@gitops-utils/utils';

type PodRowActionsProps = {
  obj?: any;
};

const PodRowActions: React.FC<PodRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const [podModel] = useK8sModel({kind: "Pod", version: "v1"});

  const [canPatch, canUpdate, canDelete] = getObjectModifyPermissions(obj, podModel);

  const { t } = useGitOpsTranslation();

  const onEditLabelsModalToggle = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: podModel,
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
            model: podModel,
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

  const onEditPod = () => {
    const cta = {
      href: `/k8s/ns/${obj.metadata.namespace || DEFAULT_NAMESPACE}/${modelToRef(podModel)}/${
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
        <DropdownItem onClick={onEditLabelsModalToggle} key="pod-edit-labels" isDisabled={!canPatch}>
          {t('Edit labels')}
        </DropdownItem>,
        <DropdownItem onClick={onEditAnnotationsModalToggle} key="pod-edit-annotations" isDisabled={!canPatch}>
          {t('Edit annotations')}
        </DropdownItem>,
        <DropdownItem onClick={onEditPod} key="pod-edit" isDisabled={!canUpdate}>
          {t('Edit Pod')}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="pod-delete" isDisabled={!canDelete}>
          {t('Delete Pod')}
        </DropdownItem>,
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default PodRowActions;