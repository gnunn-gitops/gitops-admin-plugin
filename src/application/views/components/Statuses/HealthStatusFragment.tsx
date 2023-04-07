import * as React from 'react';

import { HealthDegradedIcon, HealthHealthyIcon, HealthMissingIcon, HealthProgressingIcon, HealthSuspendedIcon, HealthUnknownIcon } from '../../utils/Icons/icons';
import { HealthStatus } from '@gitops-utils/constants';

interface HealthProps {
  status: string;
}

const HealthStatusFragment: React.FC<HealthProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  switch (status) {
    case HealthStatus.HEALTHY:
      targetIcon = <HealthHealthyIcon />;
      break;
    case HealthStatus.DEGRADED:
      targetIcon = <HealthDegradedIcon />;
      break;
    case HealthStatus.SUSPENDED:
      targetIcon = <HealthSuspendedIcon />;
      break;
    case HealthStatus.MISSING:
      targetIcon = <HealthMissingIcon />;
      break;
    case HealthStatus.PROGRESSING:
      targetIcon = <HealthProgressingIcon />;
      break;
    default:
      targetIcon = < HealthUnknownIcon />;
  }

  return (
        (
          <div>
            {targetIcon} {status}
          </div>
        )
  );
};

export default HealthStatusFragment;