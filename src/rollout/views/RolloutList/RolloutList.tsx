import React from 'react';
import { modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  RowFilter,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

import RolloutRowActions from './RolloutRowActions';
import { RolloutKind, RolloutModel } from 'src/rollout/models/RolloutModel';
import { RolloutStatus } from 'src/rollout/utils/rollout-utils';
import { RolloutStatusFragment } from '../components/rolloutstatus/RolloutStatus';
import { Label, LabelGroup } from '@patternfly/react-core';
import { Link } from 'react-router-dom';


type RolloutListProps = {
  namespace: string;
};

const RolloutList: React.FC<RolloutListProps> = ({ namespace }) => {
  const [rollouts, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Rollout',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });
  // const { t } = useTranslation();
  const columns = useRolloutColumns(namespace);
  const [data, filteredData, onFilterChange] = useListPageFilter(rollouts, filters);

  return (
    <>
      <ListPageHeader title={'Rollouts'}>
        <ListPageCreate groupVersionKind={modelToRef(RolloutModel)}>Create Rollout</ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
              data={data}
              loaded={loaded}
              rowFilters={filters}
              onFilterChange={onFilterChange}
        />
        <VirtualizedTable<K8sResourceCommon>
          data={filteredData}
          unfilteredData={rollouts}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={rolloutListRow}
        />
      </ListPageBody>
    </>
  );
};

const rolloutListRow: React.FC<RowProps<RolloutKind>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={modelToGroupVersionKind(RolloutModel)}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        <RolloutStatusFragment status={obj.status?.phase as RolloutStatus}  />
      </TableData>
      <TableData id="pods" activeColumnIDs={activeColumnIDs}>
        {obj.status && obj.status.readyReplicas && obj.status.replicas ? obj.status.readyReplicas + " of " + obj.status.replicas : "-"}
      </TableData>
      <TableData id="labels" activeColumnIDs={activeColumnIDs} >
        {obj.metadata.labels &&
          <LabelGroup>
            {Object.keys(obj.metadata.labels).map(function(key: string, index){
              return <Link to={"/search?kind=Rollout&q="+key+"%3D" + obj.metadata.labels[key]}><Label href="javascript:void(0);" color="blue">{key + "=" + obj.metadata.labels[key]}</Label></Link>;
            })}
          </LabelGroup>
        }
      </TableData>
      <TableData id="selector" activeColumnIDs={activeColumnIDs}>
        {obj.status && obj.status.selector ? obj.status.selector : "-"}
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        <RolloutRowActions obj={obj} />
      </TableData>
    </>
  );
};

const useRolloutColumns = (namespace) => {

  const columns: TableColumn<K8sResourceCommon>[] = [];

  columns.push(
    {
      title: 'Name',
      id: 'name',
      transforms: [sortable],
      sort: 'metadata.name',
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
      }
    )
  }

  columns.push(
    {
      title: 'Status',
      id: 'status',
      transforms: [sortable],
      sort: 'status.phase',
    },
    {
      title: 'Pods',
      id: 'pods',
      transforms: [sortable],
      sort: 'status.readyReplicas',
    },
    {
      title: 'Labels',
      id: 'labels',
      transforms: [sortable],
      sort: 'metadata.labels',
    },
    {
      title: 'Selector',
      id: 'selector',
      transforms: [sortable],
      sort: 'status.selector',
    },
    {
      title: '',
      id: 'actions',
      props: { className: 'dropdown-kebab-pf pf-c-table__action' },
    }
  )

  return React.useMemo(() => columns, [namespace]);
};

const filters: RowFilter[] = [
  {
    filterGroupName: 'Rollout Status',
    type: 'rollout-status',
    reducer: (rollout) => (rollout.status?.phase),
    filter: (input, rollout) => {
      if (input.selected?.length && rollout?.status?.phase) {
        return input.selected.includes(rollout.status.phase);
      } else {
        return true;
      }
    },
    items: [
      { id: RolloutStatus.Healthy, title: RolloutStatus.Healthy },
      { id: RolloutStatus.Paused, title: RolloutStatus.Paused },
      { id: RolloutStatus.Progressing, title: RolloutStatus.Progressing },
      { id: RolloutStatus.Degraded, title: RolloutStatus.Degraded }
    ],
  }];

export default RolloutList;
