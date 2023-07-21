import * as React from 'react';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { ReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
import { rollbackRollout } from 'src/services/argocd';
import { RolloutKind } from '@rollout-model/RolloutModel';

type RevisionsRowActionsProps = {
  rollout: RolloutKind,
  rsInfo: ReplicaSetInfo;
};

export const RevisionsRowActions: React.FC<RevisionsRowActionsProps> = ({ rollout, rsInfo }) => {

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const { t } = useGitOpsTranslation();

    const onRollback = () => {
      rollbackRollout(rollout, rsInfo.replicaSet);
    };

    return (
        <Dropdown
          menuAppendTo={getContentScrollableElement}
          onSelect={() => setIsDropdownOpen(false)}
          toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-disk" />}
          isOpen={isDropdownOpen}
          isPlain
          dropdownItems={[
            <DropdownItem onClick={onRollback} key="rollout-rollback" isDisabled={!rsInfo.name || rsInfo.statuses.length != 0}>
              {t('Rollback')}
            </DropdownItem>
          ]}
          position={DropdownPosition.right}
        />
      );

}

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');
