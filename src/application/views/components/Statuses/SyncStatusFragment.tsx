import * as React from 'react';

import {
  GreenCheckCircleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

import { SyncUnknownIcon, OutOfSyncIcon } from '../../../../shared/views/icons/icons';
import { SyncStatus } from '@gitops-utils/constants';

interface SyncProps {
  status: string;
}

const SyncStatusFragment: React.FC<SyncProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  if (status === SyncStatus.SYNCED) {
    targetIcon = <GreenCheckCircleIcon />;
  } else if (status === SyncStatus.OUT_OF_SYNC) {
    targetIcon = <OutOfSyncIcon />;
  } else {
    targetIcon = <SyncUnknownIcon />;
  }
  return (
        (
          <span>
            {(status?targetIcon:"")} {status}
          </span>
        )
  );
};

export default SyncStatusFragment;