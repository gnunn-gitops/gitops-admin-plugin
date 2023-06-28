import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';
import { ApplicationKind, ApplicationResourceStatus } from '@application-model';
import { syncResourcek8s } from 'src/services/argocd';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { k8sGet, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';

type ResourceRowActionsProps = {
  resource: ApplicationResourceStatus;
  application: ApplicationKind;
  argoBaseURL: string;
};

function getResourceURL(argoBaseURL: string, resource: ApplicationResourceStatus): string {
  return argoBaseURL+"?resource=&node=" + encodeURI((resource.group?resource.group:"") + "/" + resource.kind + "/" + (resource.namespace?resource.namespace:"") + "/" + resource.name);
}

const ResourceRowActions: React.FC<ResourceRowActionsProps> = ({ resource, application, argoBaseURL }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { createModal } = useModal();
  const [model] = useK8sModel({ group: resource.group, version: resource.version, kind: resource.kind });

  const getObject = () =>
    k8sGet({
      model: model,
      name: resource.name,
      ns: resource.namespace,
    });

  const onViewResource = () => {
    window.open(getResourceURL(argoBaseURL, resource), '_blank');
  };

  const onSyncResource = () => {
    syncResourcek8s(application, [resource])
  };

  const onDeleteResource = async () => {
    const obj = await getObject();
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
        <DropdownItem onClick={onViewResource} key="resource-diff">
          {'Details'}
        </DropdownItem>,
        <DropdownItem onClick={onSyncResource} key="resource-sync" isDisabled={resource.status==undefined}>
          {'Sync'}
        </DropdownItem>,
        <DropdownItem onClick={onDeleteResource} key="resource-delete">
          {'Delete'}
        </DropdownItem>
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ResourceRowActions;