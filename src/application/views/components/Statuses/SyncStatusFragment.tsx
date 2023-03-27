import * as React from 'react';

import {
  GreenCheckCircleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

import { SyncUnknownIcon, OutOfSyncIcon } from './icons';


interface SyncProps {
  status: string;
}

const SyncStatusFragment: React.FC<SyncProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  if (status === 'Synced') {
    targetIcon = <GreenCheckCircleIcon />;
  } else if (status === 'OutOfSync') {
    targetIcon = <OutOfSyncIcon />;
  } else {
    targetIcon = <SyncUnknownIcon />;
  }
  return (
        (
          <div>
            {(status?targetIcon:"")} {status}
          </div>
        )
  );
};

export default SyncStatusFragment;