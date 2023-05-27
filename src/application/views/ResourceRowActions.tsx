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
};

const ResourceRowActions: React.FC<ResourceRowActionsProps> = ({ resource }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onDiff = () => {
    console.log("diff")
  };

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={[
        <DropdownItem onClick={onDiff} key="resource-diff">
          {'Diff'}
        </DropdownItem>
      ]}
      position={DropdownPosition.right}
    />
  );
};

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export default ResourceRowActions;
