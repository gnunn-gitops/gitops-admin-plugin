import React from 'react';
import { ApplicationModel } from '@application-model/ApplicationModel';
import { ApplicationKind } from '@application-model/ApplicationModel';
import { modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

import ApplicationRowActions from './ApplicationRowActions';
import SyncStatusFragment from './SyncStatusFragment';
import HealthStatusFragment from './HealthStatusFragment';

type ApplicationListProps = {
  namespace: string;
};

const ApplicationList: React.FC<ApplicationListProps> = ({ namespace }) => {
  const [applications, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });
  // const { t } = useTranslation();
  const columns = useApplicationColumns(namespace);
  const [data, filteredData, onFilterChange] = useListPageFilter(applications);

  return (
    <>
      <ListPageHeader title={'Application'}>
        <ListPageCreate groupVersionKind={modelToRef(ApplicationModel)}>Create Application</ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<K8sResourceCommon>
          data={filteredData}
          unfilteredData={applications}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={applicationListRow}
        />
      </ListPageBody>
    </>
  );
};

const applicationListRow: React.FC<RowProps<ApplicationKind>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink
          groupVersionKind={modelToGroupVersionKind(ApplicationModel)}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData id="project" activeColumnIDs={activeColumnIDs}>
        {obj.spec.project || ''}
      </TableData>
      <TableData id="sync-status" activeColumnIDs={activeColumnIDs}>
      <SyncStatusFragment
        status={obj.status?.sync?.status || ''}
      />
      </TableData>
      <TableData id="sync-status" activeColumnIDs={activeColumnIDs}>
          <HealthStatusFragment
            status={obj.status?.health?.status || ''}
          />
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        <ApplicationRowActions obj={obj} />
      </TableData>
    </>
  );
};

const useApplicationColumns = (namespace) => {

  const columns: TableColumn<K8sResourceCommon>[] = [];

  columns.push(
    {
      title: 'Name',
      id: 'name',
      transforms: [sortable],
      sort: 'metadata.name',
      props: { className: 'pf-m-width-15' },
    }
  );
  // Only show namespace column when defined
  // Note this change removes useMemo which from what I understand
  // helps performance by not recalculating this on each render. There
  // may be a better way to do this, original code commented out below
  if (!namespace) {
    columns.push(
      {
        title: 'Namespace',
        id: 'namespace',
        transforms: [sortable],
        sort: 'metadata.namespace',
        props: { className: 'pf-m-width-15' },
      }
    )
  }
  columns.push(
    {
      title: 'Project',
      sort: 'spec.project',
      id: 'project',
      transforms: [sortable],
    },
    {
      title: 'Sync Status',
      sort: 'status.sync.status',
      id: 'sync-status',
      transforms: [sortable],
    },
    {
      title: 'Health Status',
      sort: 'status.health.status',
      id: 'health-status',
      transforms: [sortable],
    },
    {
      title: '',
      id: 'actions',
      props: { className: 'dropdown-kebab-pf pf-c-table__action' },
    }
  );

  return columns;

  // const columns: TableColumn<K8sResourceCommon>[] = React.useMemo(
  //   () => [
  //     {
  //       title: 'Name',
  //       id: 'name',
  //       transforms: [sortable],
  //       sort: 'metadata.name',
  //       props: { className: 'pf-m-width-15' },
  //     },
  //     {
  //       title: 'Namespace',
  //       id: 'namespace',
  //       transforms: [sortable],
  //       sort: 'metadata.namespace',
  //       props: { className: 'pf-m-width-15' },
  //     },
  //     {
  //       title: 'Project',
  //       sort: 'spec.project',
  //       id: 'project',
  //       transforms: [sortable],
  //     },
  //     {
  //       title: 'Sync Status',
  //       sort: 'status.sync.status',
  //       id: 'sync-status',
  //       transforms: [sortable],
  //     },
  //     {
  //       title: 'Health Status',
  //       sort: 'status.health.status',
  //       id: 'health-status',
  //       transforms: [sortable],
  //     },
  //     {
  //       title: '',
  //       id: 'actions',
  //       props: { className: 'dropdown-kebab-pf pf-c-table__action' },
  //     },
  //   ],
  //   [],
  // );

//  return columns;
};

export default ApplicationList;
