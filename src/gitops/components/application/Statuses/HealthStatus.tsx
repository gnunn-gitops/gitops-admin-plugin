import * as React from 'react';

import { HealthDegradedIcon, HealthHealthyIcon, HealthMissingIcon, HealthProgressingIcon, HealthSuspendedIcon, HealthUnknownIcon } from '@gitops-shared/Icons';
import { HealthStatus as HS } from 'src/gitops/utils/constants';
import { Button, Popover } from '@patternfly/react-core';

interface HealthProps {
  status: string;
  message?: string
}

const HealthStatus: React.FC<HealthProps> = ({ status, message }) => {
  let targetIcon: React.ReactNode;
  switch (status) {
    case HS.HEALTHY:
      targetIcon = <HealthHealthyIcon />;
      break;
    case HS.DEGRADED:
      targetIcon = <HealthDegradedIcon />;
      break;
    case HS.SUSPENDED:
      targetIcon = <HealthSuspendedIcon />;
      break;
    case HS.MISSING:
      targetIcon = <HealthMissingIcon />;
      break;
    case HS.PROGRESSING:
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

export default HealthStatus;
