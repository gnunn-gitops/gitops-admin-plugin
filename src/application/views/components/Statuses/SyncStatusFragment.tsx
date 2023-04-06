import * as React from 'react';

import {
  GreenCheckCircleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

import { SyncUnknownIcon, OutOfSyncIcon } from '../../utils/Icons/icons';
import { SYNC_STATUS_OUT_OF_SYNC, SYNC_STATUS_SYNCED } from '@gitops-utils/constants';


interface SyncProps {
  status: string;
}

const SyncStatusFragment: React.FC<SyncProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  if (status === SYNC_STATUS_SYNCED) {
    targetIcon = <GreenCheckCircleIcon />;
  } else if (status === SYNC_STATUS_OUT_OF_SYNC) {
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