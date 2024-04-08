import { StatusGroupMapper } from '@openshift-console/dynamic-plugin-sdk';

import { ApplicationSetStatus } from '@gitops-utils/constants';
import { ApplicationSetKind } from '@gitops-models/ApplicationSetModel';
import { InventoryStatusGroup } from './dashboardUtils';
import { getAppSetStatus } from '@gitops-utils/gitops';

export const getApplicationSetStatusGroups: StatusGroupMapper = (appsets) => {
  const groups = {
    [InventoryStatusGroup.ERROR]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [ApplicationSetStatus.ERROR],
    },
    [InventoryStatusGroup.NOT_MAPPED]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [ApplicationSetStatus.HEALTHY],
    },
    [InventoryStatusGroup.UNKNOWN]: {
      count: 0,
      filterType: 'app-health',
      statusIDs: [
        ApplicationSetStatus.UNKNOWN
      ],
    }
  };

  appsets.forEach((appset: ApplicationSetKind) => {
    const group =
      Object.keys(groups).find((key) =>
        groups[key].statusIDs.includes(getAppSetStatus(appset)) ,
      ) || InventoryStatusGroup.NOT_MAPPED;
    groups[group].count++;
  });

  return groups;
};
