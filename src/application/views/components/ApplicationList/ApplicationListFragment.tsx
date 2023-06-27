import React from 'react';
import { K8sResourceCommon, ListPageBody, ListPageCreate, ListPageFilter, ListPageHeader, ResourceLink, RowFilter, RowProps, TableColumn, TableData, VirtualizedTable, useK8sWatchResource, useListPageFilter } from "@openshift-console/dynamic-plugin-sdk";
import { modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
import { ApplicationKind, ApplicationModel } from '@application-model';
import { HealthStatus, SyncStatus } from '@gitops-utils/constants';
import { Flex, FlexItem } from '@patternfly/react-core';
import SyncStatusFragment from '../Statuses/SyncStatusFragment';
import { OperationStateFragment } from '../Statuses/OperationStateFragment';
import HealthStatusFragment from '../Statuses/HealthStatusFragment';
import RevisionFragment from '../Revision/RevisionFragment';
import ApplicationRowActions from './ApplicationRowActions';
import { sortable } from '@patternfly/react-table';
import { AppProjectKind } from '@appproject-model';

interface ApplicationProps {
  namespace: string;
  // Here to support plugging in view in Projects (i.e. show list of apps that belong to project)
  // Needs the console API to support defining your own static filter though since neither a label
  // or a field-selector is available to select just the project apps based on k8s watch api.
  project?: AppProjectKind;
  appset?: K8sResourceCommon;
}

function filterApp(project: AppProjectKind, appset: K8sResourceCommon) {
    return function(app: ApplicationKind) {

        if (project != undefined) {
          return (app.spec.project == project.metadata.name)
        } else if (appset != undefined) {
          if (app.metadata.ownerReferences == undefined) return false;
          app.metadata.ownerReferences.forEach( (owner) => {
            console.log(owner.kind + "," + owner.name + "=" + appset.metadata.name);
            if (owner.kind == appset.kind && owner.name == appset.metadata.name) return true;
          });
          return false;
        }
        return true;
    }
}

const ApplicationListFragment: React.FC<ApplicationProps> = ({ namespace, project, appset }) => {

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

      const [data, filteredData, onFilterChange] = useListPageFilter(applications, filters);

    return (
        <div>
          {(project == undefined || appset == undefined) &&
            <ListPageHeader title={'Applications'}>
              <ListPageCreate groupVersionKind={modelToRef(ApplicationModel)}>Create Application</ListPageCreate>
            </ListPageHeader>
          }
          <ListPageBody>
            <ListPageFilter
              data={data.filter(filterApp(project, appset))}
              loaded={loaded}
              rowFilters={filters}
              onFilterChange={onFilterChange}
            />
            <VirtualizedTable<K8sResourceCommon>
              data={filteredData.filter(filterApp(project, appset))}
              unfilteredData={data.filter(filterApp(project, appset))}
              loaded={loaded}
              loadError={loadError}
              columns={columns}
              Row={applicationListRow}
            />
          </ListPageBody>
          </div>
    )
}

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
        <TableData id="sync-status" activeColumnIDs={activeColumnIDs}>
          <Flex>
            <FlexItem>
              <SyncStatusFragment
                status={obj.status?.sync?.status || ''}
              />
            </FlexItem>
            <FlexItem>
              <OperationStateFragment app={obj} quiet={true} />
            </FlexItem>
          </Flex>
        </TableData>
        <TableData id="health-status" activeColumnIDs={activeColumnIDs}>
          <HealthStatusFragment
            status={obj.status?.health?.status || ''}
          />
        </TableData>
        <TableData id="revision" activeColumnIDs={activeColumnIDs}>
          <RevisionFragment
            revision={obj.status?.sync?.revision || ''}
            repoURL={obj.spec.source.repoURL}
            helm={obj.status?.sourceType == "Helm"}
          />
        </TableData>
        <TableData id="project" activeColumnIDs={activeColumnIDs}>
          {obj.spec.project || ''}
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
        title: 'Revision',
        sort: 'status.sync.revision',
        id: 'revision',
        transforms: [sortable],
      },
      {
        title: 'Project',
        sort: 'spec.project',
        id: 'project',
        transforms: [sortable],
      },
      {
        title: '',
        id: 'actions',
        props: { className: 'dropdown-kebab-pf pf-c-table__action' },
      }
    );

    return React.useMemo(() => columns, [namespace]);
  };

  // Need to differentiate between Sync and Health Unknown for filtering
  const FilterUnknownStatus: string = 'Sync.'+SyncStatus.UNKNOWN;

  export const filters: RowFilter[] = [
    {
      filterGroupName: 'Sync Status',
      type: 'app-sync',
      reducer: (application) => (application.status?.sync?.status),
      filter: (input, application) => {
        if (input.selected?.length && application?.status?.sync?.status) {
          return input.selected.includes(application.status.sync.status) ||
                 (input.selected.includes(FilterUnknownStatus) && application.status.sync.status == SyncStatus.UNKNOWN)
        } else {
          return true;
        }
      },
      items: [
        { id: SyncStatus.SYNCED, title: SyncStatus.SYNCED },
        { id: SyncStatus.OUT_OF_SYNC, title: SyncStatus.OUT_OF_SYNC },
        { id: FilterUnknownStatus, title: SyncStatus.UNKNOWN },
      ],
    },
    {
      filterGroupName: 'Health Status',
      type: 'app-health',
      reducer: (application) => (application.status?.health?.status),
      filter: (input, application) => {
        if (input.selected?.length && application?.status?.health?.status) {
          return input.selected.includes(application.status.health.status);
        } else {
          return true;
        }
      },
      items: [
        { id: HealthStatus.UNKNOWN, title: HealthStatus.UNKNOWN },
        { id: HealthStatus.PROGRESSING, title: HealthStatus.PROGRESSING },
        { id: HealthStatus.SUSPENDED, title: HealthStatus.SUSPENDED },
        { id: HealthStatus.HEALTHY, title: HealthStatus.HEALTHY },
        { id: HealthStatus.DEGRADED, title: HealthStatus.DEGRADED },
        { id: HealthStatus.MISSING, title: HealthStatus.MISSING },
      ],
    }
  ];

export default ApplicationListFragment;