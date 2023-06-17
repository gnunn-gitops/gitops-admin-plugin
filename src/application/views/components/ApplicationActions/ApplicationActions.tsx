import React from 'react';
import { getContentScrollableElement } from 'src/application/views/components/ApplicationList/ApplicationRowActions';
import { useApplicationActionsProvider } from 'src/application/views/hooks/useApplicationActionsProvider';

import { ApplicationKind } from '@application-model';
import { Action } from '@openshift-console/dynamic-plugin-sdk';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  KebabToggle,
} from '@patternfly/react-core';

import './ApplicationActions.scss';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ApplicationActionProps = {
  application: ApplicationKind;
  isKebabToggle?: boolean;
};

export const ApplicationActions: React.FC<ApplicationActionProps> = ({ application, isKebabToggle }) => {
  const { t } = useGitOpsTranslation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [actions /*, onLazyOpen*/] = useApplicationActionsProvider(application);

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
