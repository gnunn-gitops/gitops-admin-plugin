import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';
import { ApplicationKind, ApplicationResourceStatus } from '@application-model';
import { syncResource } from 'src/services/argocd';

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

  const onViewResource = () => {
    window.open(getResourceURL(argoBaseURL, resource), '_blank');
  };

  const onSyncResource = () => {
    syncResource(application, resource)
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
        </DropdownItem>
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ResourceRowActions;
