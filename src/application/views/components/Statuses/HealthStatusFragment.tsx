import * as React from 'react';

import { HealthDegradedIcon, HealthHealthyIcon, HealthMissingIcon, HealthProgressingIcon, HealthSuspendedIcon, HealthUnknownIcon } from '../../utils/Icons/icons';
import { HealthStatus } from '@gitops-utils/constants';
import { Button, Popover } from '@patternfly/react-core';

interface HealthProps {
  status: string;
  message?: string
}

const HealthStatusFragment: React.FC<HealthProps> = ({ status, message }) => {
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

  let showStatus: React.ReactFragment;
  if (message) {
    showStatus = (
      <div>
      <Popover
        aria-label="Health Status"
        headerContent={<div>{status}</div>}
        bodyContent={<div>{message}</div>}
      >
        <Button variant="link" isInline component="span">{targetIcon} {status}</Button>
      </Popover>
      </div>
    )
  } else {
    showStatus = (
      <div>{targetIcon} {status}</div>
    )
  }


  return (
        (
          <div>
            {showStatus}
          </div>
        )
  );
};

export default HealthStatusFragment;