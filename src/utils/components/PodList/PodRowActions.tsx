import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { useAnnotationsModal, useK8sModel, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/deprecated';

import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';
import { getObjectModifyPermissions, modelToRef } from '@gitops-utils/utils';

type PodRowActionsProps = {
  obj?: any;
};

const PodRowActions: React.FC<PodRowActionsProps> = ({ obj }) => {
  const { createModal } = useModal();
  const history = useHistory();
  const [isOpen, setIsOpen] = React.useState(false);

  const [podModel] = useK8sModel({kind: "Pod", version: "v1"});

  const [canPatch, canUpdate, canDelete] = getObjectModifyPermissions(obj, podModel);

  const { t } = useGitOpsTranslation();

  const launchLabelsModal = useLabelsModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);

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

  const onToggle = (_event: any, isOpen: boolean) => {
    setIsOpen(isOpen);
};

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsOpen(false)}
      toggle={<KebabToggle onToggle={onToggle} id="toggle-id-disk" />}
      isOpen={isOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={launchLabelsModal} key="pod-edit-labels" isDisabled={!canPatch}>
          {t('Edit labels')}
        </DropdownItem>,
        <DropdownItem onClick={launchAnnotationsModal} key="pod-edit-annotations" isDisabled={!canPatch}>
          {t('Edit annotations')}
        </DropdownItem>,
        <DropdownItem onClick={onEditPod} key="pod-edit" isDisabled={!canUpdate}>
          {t('Edit Pod')}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteModalToggle} key="pod-delete" isDisabled={!canDelete}>
          {t('Delete Pod')}
        </DropdownItem>,
      ]}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default PodRowActions;
