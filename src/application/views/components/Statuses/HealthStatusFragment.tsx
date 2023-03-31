import * as React from 'react';

import { HealthDegradedIcon, HealthHealthyIcon, HealthMissingIcon, HealthProgressingIcon, HealthSuspendedIcon, HealthUnknownIcon } from './icons';
import { HEALTH_STATUS_DEGRADED, HEALTH_STATUS_HEALTHY, HEALTH_STATUS_MISSING, HEALTH_STATUS_PROGRESSING, HEALTH_STATUS_SUSPENDED } from '@gitops-utils/constants';

interface HealthProps {
  status: string;
}

const HealthStatusFragment: React.FC<HealthProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  if (status === HEALTH_STATUS_HEALTHY) {
    targetIcon = <HealthHealthyIcon />;
  } else if (status === HEALTH_STATUS_DEGRADED) {
    targetIcon = <HealthDegradedIcon />;
  } else if (status === HEALTH_STATUS_SUSPENDED) {
    targetIcon = <HealthSuspendedIcon />;
  } else if (status === HEALTH_STATUS_MISSING) {
    targetIcon = <HealthMissingIcon />;
  } else if (status === HEALTH_STATUS_PROGRESSING) {
    targetIcon = <HealthProgressingIcon />;
  } else {
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