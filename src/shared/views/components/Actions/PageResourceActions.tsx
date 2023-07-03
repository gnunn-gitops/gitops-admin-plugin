import React from 'react';
import { getContentScrollableElement } from 'src/application/views/components/ApplicationList/ApplicationRowActions';

import { Action, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  KebabToggle,
} from '@patternfly/react-core';

import './PageResourceActions.scss';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type PageResourceActionProps = {
  obj: K8sResourceCommon;
  actions: Action[];
  isKebabToggle?: boolean;
};

export const PageResourceAction: React.FC<PageResourceActionProps> = ({ obj, actions, isKebabToggle }) => {
  const { t } = useGitOpsTranslation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleClick = (action: Action) => {
    if (typeof action?.cta === 'function') {
      action.cta();
    }
    setIsOpen(false);
  };

  const onDropDownToggle = (value: boolean) => {
    setIsOpen(value);
    /*if (value) onLazyOpen();*/
  };

  return (
    <Dropdown
      menuAppendTo={getContentScrollableElement}
      data-test-id="console-application-actions"
      isPlain={isKebabToggle}
      isOpen={isOpen}
      position={DropdownPosition.right}
      toggle={
        isKebabToggle ? (
          <KebabToggle onToggle={onDropDownToggle} />
        ) : (
          <DropdownToggle onToggle={onDropDownToggle}>{t('Actions')}</DropdownToggle>
        )
      }
      dropdownItems={actions?.map((action) => (
        <DropdownItem
          data-test-id={action?.id}
          key={action?.id}
          onClick={() => handleClick(action)}
          isDisabled={action?.disabled}
          description={action?.description}
        >
          {action?.label}
        </DropdownItem>
      ))}
    />
  );
};
