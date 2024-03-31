import * as React from 'react';
import { FC, memo, useState } from 'react';

import ActionDropdownItem from '@utils/components/ActionDropDownItem/ActionDropDownItem';
import DropdownToggle from '@utils/components/toggles/DropDownToggle';
import KebabToggle from '@utils/components/toggles/KebabToggle';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { Action } from '@openshift-console/dynamic-plugin-sdk';
import { Dropdown, DropdownList } from '@patternfly/react-core';

type ActionsDropdownProps = {
  actions: Action[];
  className?: string;
  id?: string;
  isKebabToggle?: boolean;
  onLazyClick?: () => void;
};

const ActionsDropdown: FC<ActionsDropdownProps> = ({
  actions = [],
  className,
  id,
  isKebabToggle,
  onLazyClick,
}) => {
  const { t } = useGitOpsTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => {
    setIsOpen((prevIsOpen) => {
      if (onLazyClick && !prevIsOpen) onLazyClick();

      return !prevIsOpen;
    });
  };

  const Toggle = isKebabToggle
    ? KebabToggle({ isExpanded: isOpen, onClick: onToggle })
    : DropdownToggle({
        children: t('Actions'),
        isExpanded: isOpen,
        onClick: onToggle,
      });

  return (
    <Dropdown
      className={className}
      data-test-id={id}
      isOpen={isOpen}
      onOpenChange={(open: boolean) => setIsOpen(open)}
      popperProps={{ enableFlip: true, position: 'right' }}
      toggle={Toggle}
    >
      <DropdownList>
        {actions?.map((action) => (
          <ActionDropdownItem action={action} key={action?.id} setIsOpen={setIsOpen} />
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export default memo(ActionsDropdown);
