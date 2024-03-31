import * as React from 'react';
import { Ref } from 'react';

import { MenuToggle, MenuToggleElement, MenuToggleProps } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';

const KebabToggle = (props: MenuToggleProps) => (toggleRef: Ref<MenuToggleElement>) =>
  (
    <MenuToggle ref={toggleRef} {...props} variant="plain">
      <EllipsisVIcon />
    </MenuToggle>
  );

export default KebabToggle;
