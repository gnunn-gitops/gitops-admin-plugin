import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';
import { ApplicationResourceStatus } from '@application-model';


type ResourceRowActionsProps = {
  resource: ApplicationResourceStatus;
  argoBaseURL: string;
};

function getResourceURL(argoBaseURL: string, resource: ApplicationResourceStatus): string {
  return argoBaseURL+"?resource=&node=" + encodeURI((resource.group?resource.group:"") + "/" + resource.kind + "/" + (resource.namespace?resource.namespace:"") + "/" + resource.name);
}

const ResourceRowActions: React.FC<ResourceRowActionsProps> = ({ resource, argoBaseURL }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onViewResource = () => {
    window.open(getResourceURL(argoBaseURL, resource), '_blank');
  };

  console.log(argoBaseURL);

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onViewResource} key="resource-diff">
          <span>View (Argo CD)</span>
        </DropdownItem>
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ResourceRowActions;
