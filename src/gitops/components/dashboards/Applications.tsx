import * as React from 'react';

import { StatusGroupMapper } from '@openshift-console/dynamic-plugin-sdk';

import { HealthStatus } from '@gitops-utils/constants';
import { ApplicationKind } from '@gitops-models/ApplicationModel';
import { InventoryStatusGroup } from './dashboardUtils';
import { OutlinedPauseCircleIcon } from '@patternfly/react-icons';

import { global_disabled_color_100 } from '@patternfly/react-tokens/dist/js/global_disabled_color_100';

export const getApplicationStatusGroups: StatusGroupMapper = (apps) => {
  const groups = {
    [InventoryStatusGroup.ERROR]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [HealthStatus.DEGRADED],
    },
    [InventoryStatusGroup.NOT_MAPPED]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [HealthStatus.HEALTHY],
    },
    [InventoryStatusGroup.PROGRESS]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [
        HealthStatus.PROGRESSING
      ],
    },
    [InventoryStatusGroup.UNKNOWN]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [
        HealthStatus.UNKNOWN
      ],
    },
    [InventoryStatusGroup.WARN]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [
        HealthStatus.MISSING
      ],
    },
    'gitops-suspended': {
        count: 0,
        filterType: 'app-health',
        statusIDs: [
          HealthStatus.SUSPENDED
        ],
    }
  };

  apps.forEach((app: ApplicationKind) => {
    const group =
      Object.keys(groups).find((key) =>
        groups[key].statusIDs.includes(app.status?.health?.status) ,
      ) || InventoryStatusGroup.NOT_MAPPED;
    groups[group].count++;
  });

  return groups;
};

export const HealthSuspendedIcon: React.FC = () => {
    return (
        <OutlinedPauseCircleIcon color={global_disabled_color_100.value} />
    )
}
