import * as React from 'react';
import {
  Dropdown,
  DropdownItem
} from '@patternfly/react-core';
import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';
import { syncResourcek8s } from '@gitops-services/ArgoCD';
import { useDeleteModal } from '@openshift-console/dynamic-plugin-sdk';
import KebabToggle from '@utils/components/toggles/KebabToggle';

type ResourceRowActionsProps = {
  resource: ApplicationResourceStatus;
  application: ApplicationKind;
  argoBaseURL: string;
};

function getResourceURL(argoBaseURL: string, resource: ApplicationResourceStatus): string {
  return argoBaseURL+"?resource=&node=" + encodeURI((resource.group?resource.group:"") + "/" + resource.kind + "/" + (resource.namespace?resource.namespace:"") + "/" + resource.name);
}

const ResourceRowActions: React.FC<ResourceRowActionsProps> = ({ resource, application, argoBaseURL }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = () => {
    setIsOpen((prevIsOpen) => {
      return !prevIsOpen;
    });
  };

  const launchDeleteModal = useDeleteModal(resource);

  const onViewResource = () => {
    window.open(getResourceURL(argoBaseURL, resource), '_blank');
  };

  const onSyncResource = () => {
    syncResourcek8s(application, [resource])
  };

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsOpen(false)}
      toggle={KebabToggle({ isExpanded: isOpen, onClick: onToggle })}
      isOpen={isOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onViewResource} key="resource-diff">
          {'Details'}
        </DropdownItem>,
        <DropdownItem onClick={onSyncResource} key="resource-sync" isDisabled={resource.status==undefined}>
          {'Sync'}
        </DropdownItem>,
        <DropdownItem onClick={launchDeleteModal} key="resource-delete">
          {'Delete'}
        </DropdownItem>
      ]}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ResourceRowActions;
