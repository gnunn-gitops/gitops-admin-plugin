import * as React from 'react';

import { ApplicationSetStatus } from '@gitops-utils/constants';
import { HealthDegradedIcon, HealthHealthyIcon, HealthUnknownIcon } from '@utils/components/Icons/Icons';

interface SyncProps {
  status: ApplicationSetStatus
}

const SyncStatus: React.FC<SyncProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  switch (status) {
    case ApplicationSetStatus.HEALTHY:
        targetIcon = <HealthHealthyIcon />;
        break;
    case ApplicationSetStatus.ERROR:
        targetIcon = <HealthDegradedIcon />;
        break;
    case ApplicationSetStatus.UNKNOWN:
        targetIcon = <HealthUnknownIcon />;
        break;
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
