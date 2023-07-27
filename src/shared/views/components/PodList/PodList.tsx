import { K8sGroupVersionKind, K8sResourceCommon, ListPageBody, ListPageCreate, ListPageFilter, ListPageHeader, PrometheusEndpoint, ResourceLink, RowFilter, RowProps, Selector, TableColumn, TableData, Timestamp, VirtualizedTable, useK8sWatchResource, useListPageFilter, usePrometheusPoll } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import * as React from 'react';

type PodListProps = {
  namespace: string;
  selector: Selector;
};

const gvk: K8sGroupVersionKind = {
  kind: 'Pod',
  version: 'v1',
}

enum PodStatus {
  RUNNING = "Running",
  COMPLETED = "Completed",
  PENDING = "Pending",
  TERMINATING = "Terminating",
  FAILED = "Failed",
  UNKNOWN = "Unknown",
  CRASHLOOPBACKOFF = "CrashLoopBackOff"
}

const podContainerStatuses = (pod: any): { readyCount: number; totalContainers: number; restartCount: number } => {
  // Don't include init containers in readiness count. This is consistent with the CLI.
  const containerStatuses = pod?.status?.containerStatuses || [];
  return containerStatuses.reduce(
    (acc, { ready, restartCount }) => {
      if (ready) {
        acc.readyCount = acc.readyCount + 1;
      }
      acc.restartCount = acc.restartCount + restartCount;
      return acc;
    },
    { readyCount: 0, totalContainers: containerStatuses.length, restartCount: 0 },
  );
};

export const PodList: React.FC<PodListProps> = ({ namespace, selector }) => {

  const [pods, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: gvk,
    namespaced: true,
    namespace,
    selector: selector
  });

  const [memResults] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query: "sum(container_memory_working_set_bytes{namespace='" + namespace + "',container=''}) BY (pod, namespace)"
  });

  const [cpuResults] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query: "pod:container_cpu_usage:sum{namespace='" + namespace + "'}"
  });

  const columns = usePodColumns(namespace);

  const [data, filteredData, onFilterChange] = useListPageFilter(pods, filters);

  return (
    <div>
      <ListPageHeader title={'Pods'}>
        <ListPageCreate groupVersionKind={"Pod"}>Create Application</ListPageCreate>
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
          unfilteredData={data}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={podListRow}
          rowData={{memResults, cpuResults}}
        />
      </ListPageBody>
    </div>
  )
}

function getMetric(podName: string, results): string {
  var value: string = "-";
  if (results.data) {
    results.data.result.forEach((result) => {
      if (result.metric.pod == podName) {
        value = ""+result.value[1];
      }
    })
  }
  return value;
}

function formatMemoryMetric(value: string) {

  var metric: number = Number(value);
  metric = metric / 1024;
  if (metric < 100) return metric.toFixed(1) + " KiB"
  metric = metric / 1024;
  if (metric < 100) return metric.toFixed(1) + " MiB"
  metric = metric / 1024;
  if (metric < 100) return metric.toFixed(1) + " GiB"
}

function formatCPUMetric(value: string) {
  var metric: number = Number(value) * 1000;
  return metric.toFixed(3) + " cores";
}

const podListRow: React.FC<RowProps<any, {memResults, cpuResults}>> = ({ obj, activeColumnIDs, rowData: {memResults, cpuResults} }) => {

  const {readyCount, totalContainers, restartCount} = podContainerStatuses(obj);

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink
          groupVersionKind={gvk}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
          inline={true}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        {obj.status?.phase ? obj.status?.phase : "-"}
      </TableData>
      <TableData id="ready" activeColumnIDs={activeColumnIDs}>
        {readyCount + "/" + totalContainers}
      </TableData>
      <TableData id="restarts" activeColumnIDs={activeColumnIDs}>
        {restartCount}
      </TableData>
      <TableData id="owner" activeColumnIDs={activeColumnIDs}>
        {obj.metadata?.ownerReferences ?
          obj.metadata.ownerReferences.map(function(owner, index){
            return (<><ResourceLink kind={owner.kind} name={owner.name} namespace={owner.namespace}/><br/></>);
          })
        :
          "-"
        }
      </TableData>
      <TableData id="memory" activeColumnIDs={activeColumnIDs}>
        {memResults &&
          <span>{formatMemoryMetric(getMetric(obj.metadata.name, memResults))}</span>
        }
      </TableData>
      <TableData id="cpu" activeColumnIDs={activeColumnIDs}>
        {cpuResults &&
          <span>{formatCPUMetric(getMetric(obj.metadata.name, cpuResults))}</span>
        }
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        -
      </TableData>
    </>
  );
};

const usePodColumns = (namespace) => {

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
      title: 'Status',
      id: 'status',
      transforms: [sortable],
      sort: 'status.phase',
    },
    {
      title: 'Ready',
      sort: 'status.containerStatuses',
      id: 'ready',
      transforms: [sortable],
    },
    {
      title: 'Restarts',
      sort: 'restarts',
      id: 'restarts',
      transforms: [sortable],
    },
    {
      title: 'Owner',
      sort: 'metadata.ownerReferences',
      id: 'owner',
      transforms: [sortable],
    },
    {
      title: 'Memory',
      id: 'memory',
      transforms: []
    },
    {
      title: 'CPU',
      id: 'cpu',
      transforms: []
    },
    {
      title: 'Created At',
      sort: 'metadata.creationTimestamp',
      id: 'created',
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

const filters: RowFilter[] = [
  {
    filterGroupName: 'Health Status',
    type: 'app-health',
    reducer: (pod) => (pod.status?.phase),
    filter: (input, pod) => {
      if (input.selected?.length && pod?.status?.phase) {
        return input.selected.includes(pod.status.phase);
      } else {
        return true;
      }
    },
    items: [
      { id: PodStatus.RUNNING, title: PodStatus.RUNNING },
      { id: PodStatus.PENDING, title: PodStatus.PENDING },
      { id: PodStatus.TERMINATING, title: PodStatus.TERMINATING },
      { id: PodStatus.CRASHLOOPBACKOFF, title: PodStatus.CRASHLOOPBACKOFF },
      { id: PodStatus.COMPLETED, title: PodStatus.COMPLETED },
      { id: PodStatus.FAILED, title: PodStatus.FAILED },
      { id: PodStatus.UNKNOWN, title: PodStatus.UNKNOWN },
    ],
  }
];
