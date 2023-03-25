import * as React from 'react';

import { HealthDegradedIcon, HealthHealthyIcon, HealthMissingIcon, HealthProgressingIcon, HealthSuspendedIcon, HealthUnknownIcon } from '../../../utils/status/icons';

interface HealthProps {
  status: string;
}

const HealthStatusFragment: React.FC<HealthProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  if (status === 'Healthy') {
    targetIcon = <HealthHealthyIcon />;
  } else if (status === 'Degraded') {
    targetIcon = <HealthDegradedIcon />;
  } else if (status === 'Suspended') {
    targetIcon = <HealthSuspendedIcon />;
  } else if (status === 'Missing') {
    targetIcon = <HealthMissingIcon />;
  } else if (status === 'Progressing') {
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