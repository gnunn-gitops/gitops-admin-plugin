import * as React from 'react';

import {
  GreenCheckCircleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

import { SyncUnknownIcon, OutOfSyncIcon } from '@gitops-shared/Icons';
import { SyncStatus as SS } from '@gitops-utils/constants';

interface SyncProps {
  status: string;
}

const SyncStatus: React.FC<SyncProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  if (status === SS.SYNCED) {
    targetIcon = <GreenCheckCircleIcon />;
  } else if (status === SS.OUT_OF_SYNC) {
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

export default SyncStatus;
