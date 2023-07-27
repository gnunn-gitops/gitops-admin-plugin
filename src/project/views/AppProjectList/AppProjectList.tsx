import React from 'react';
import { AppProjectModel } from '@appproject-model/AppProjectModel';
import { AppProjectKind } from '@appproject-model/AppProjectModel';
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

import AppProjectRowActions from './AppProjectRowActions';


type AppProjectListProps = {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const AppProjectList: React.FC<AppProjectListProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
  const [appProjects, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'AppProject',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });
  // const { t } = useTranslation();
  const columns = useAppProjectColumns(namespace);
  const [data, filteredData, onFilterChange] = useListPageFilter(appProjects);

  return (
    <>
      {showTitle == undefined &&
        <ListPageHeader title={'Projects'}>
          <ListPageCreate groupVersionKind={modelToRef(AppProjectModel)}>Create Project</ListPageCreate>
        </ListPageHeader>
      }
      <ListPageBody>
        {!hideNameLabelFilters &&
          <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        }
        <VirtualizedTable<K8sResourceCommon>
          data={filteredData}
          unfilteredData={appProjects}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={appProjectListRow}
        />
      </ListPageBody>
    </>
  );
};

const appProjectListRow: React.FC<RowProps<AppProjectKind>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink
          groupVersionKind={modelToGroupVersionKind(AppProjectModel)}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData id="description" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        {obj.spec.description || '-'}
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        <AppProjectRowActions obj={obj} />
      </TableData>
    </>
  );
};

const useAppProjectColumns = (namespace) => {

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
      title: 'Description',
      id: 'description',
      transforms: [sortable],
      sort: 'spec.description',
      props: { className: 'pf-m-width-15' },
    },
    {
      title: '',
      id: 'actions',
      props: { className: 'dropdown-kebab-pf pf-c-table__action' },
    }
  )

  return React.useMemo(() => columns, [namespace]);
};

export default AppProjectList;
