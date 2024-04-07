import * as React from 'react';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { ReplicaSetInfo, ReplicaSetStatus } from 'src/rollout/utils/ReplicaSetInfo';
import { rollbackRollout } from '@rollout-services/Rollout';
import { RolloutKind } from '@rollout-models/RolloutModel';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/deprecated';

type RevisionsRowActionsProps = {
  rollout: RolloutKind,
  rsInfo: ReplicaSetInfo;
};

export const RevisionsRowActions: React.FC<RevisionsRowActionsProps> = ({ rollout, rsInfo }) => {

    const [isOpen, setIsOpen] = React.useState(false);

    const { t } = useGitOpsTranslation();

    const onRollback = () => {
      rollbackRollout(rollout, rsInfo.replicaSet);
    };

    const onToggle = (_event: any, isOpen: boolean) => {
        setIsOpen(isOpen);
    };

    return (
        <Dropdown
          menuAppendTo={getContentScrollableElement}
          onSelect={() => setIsOpen(false)}
          toggle={<KebabToggle onToggle={onToggle} id="toggle-id-disk" />}
          isOpen={isOpen}
          isPlain
          dropdownItems={[
            <DropdownItem onClick={onRollback} key="rollout-rollback" isDisabled={!rsInfo.name || rsInfo.statuses.includes(ReplicaSetStatus.Active)}>
              {t('Rollback')}
            </DropdownItem>
          ]}
        />
      );

}

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');
