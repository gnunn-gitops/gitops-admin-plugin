import React from 'react';
import { getContentScrollableElement } from '../../AppProjectList/AppProjectRowActions';
import { useAppProjectActionsProvider } from '../../hooks/useAppProjectActionsProvider';

import { AppProjectKind } from '@appproject-model';
import { Action } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  KebabToggle,
} from '@patternfly/react-core';

import './AppProjectActions.scss';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type AppProjectActionProps = {
  appProject: AppProjectKind;
  isKebabToggle?: boolean;
};

export const AppProjectActions: React.FC<AppProjectActionProps> = ({ appProject, isKebabToggle }) => {
  const { t } = useGitOpsTranslation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [actions /*, onLazyOpen*/] = useAppProjectActionsProvider(appProject);

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
      data-test-id="console-app-project-actions"
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
