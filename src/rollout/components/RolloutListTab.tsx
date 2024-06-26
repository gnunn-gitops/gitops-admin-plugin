import * as React from 'react';
import {
    Action,
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

import { RolloutKind, RolloutModel } from 'src/rollout/models/RolloutModel';
import { RolloutStatus } from 'src/rollout/utils/rollout-utils';
import { RolloutStatusFragment } from './RolloutStatus';
import { Label, LabelGroup } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { getSelectorSearchURL, modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
import ActionsDropdown from '@utils/components/ActionDropDown/ActionDropDown'
import { useRolloutActionsProvider } from './hooks/useRolloutActionsProvider';

type RolloutListTabProps = {
    namespace: string;
    hideNameLabelFilters?: boolean;
    showTitle?: boolean;
};

const RolloutListTab: React.FC<RolloutListTabProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
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
            {showTitle == undefined &&
                <ListPageHeader title={'Rollouts'}>
                    <ListPageCreate groupVersionKind={modelToRef(RolloutModel)}>Create Rollout</ListPageCreate>
                </ListPageHeader>
            }
            <ListPageBody>
                {!hideNameLabelFilters &&
                    <ListPageFilter
                        data={data}
                        loaded={loaded}
                        rowFilters={filters}
                        onFilterChange={onFilterChange}
                    />
                }
                <VirtualizedTable<K8sResourceCommon>
                    data={filteredData}
                    unfilteredData={rollouts}
                    loaded={loaded}
                    loadError={loadError}
                    columns={columns}
                    Row={rolloutListRow}
                    rowData={{ namespaceScope: (namespace != undefined) }}
                />
            </ListPageBody>
        </>
    );
};

const rolloutListRow: React.FC<RowProps<RolloutKind, { namespaceScope: boolean }>> = ({ obj, activeColumnIDs, rowData: { namespaceScope } }) => {

    const actionList: [actions: Action[]] = useRolloutActionsProvider(obj);

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
                <RolloutStatusFragment status={obj.status?.phase as RolloutStatus} />
            </TableData>
            <TableData id="pods" activeColumnIDs={activeColumnIDs}>
                {obj.status && obj.status.readyReplicas && obj.status.replicas ? obj.status.readyReplicas + " of " + obj.status.replicas : "-"}
            </TableData>
            <TableData id="labels" activeColumnIDs={activeColumnIDs} >
                {obj.metadata.labels &&
                    <LabelGroup>
                        {Object.keys(obj.metadata.labels).map(function (key: string, index) {
                            return (
                                <Label color="blue" href="javascript:void(0);">
                                    <Link to={getSelectorSearchURL(namespaceScope ? obj.metadata.namespace : undefined, "Rollout", key + "=" + obj.metadata.labels[key])}>{key + "=" + obj.metadata.labels[key]}</Link>
                                </Label>
                            );
                        })}
                    </LabelGroup>
                }
            </TableData>
            <TableData id="selector" activeColumnIDs={activeColumnIDs}>
                {obj.status && obj.status.selector ?
                    <Link to={getSelectorSearchURL(obj.metadata.namespace, "Pod", obj.status.selector)}>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}><SearchIcon className="pf-u-pr-xs" />{obj.status.selector}</span>
                    </Link>
                    :
                    "-"
                }
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-v5-c-table__action"
            >
                <ActionsDropdown
                    actions={actionList ? actionList[0] : []}
                    id="rollout-actions"
                    isKebabToggle={true}
                />
            </TableData>
        </>
    );
};

const useRolloutColumns = (namespace) => {

    const columns: TableColumn<K8sResourceCommon>[] = React.useMemo(
        () => [
            {
                title: 'Name',
                id: 'name',
                transforms: [sortable],
                sort: 'metadata.name'
            },
            ...(!namespace
                ? [
                    {
                        id: 'namespace',
                        sort: 'metadata.namespace',
                        title: 'Namespace',
                        transforms: [sortable],
                    },
                ]
                : []),
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
                props: { className: 'dropdown-kebab-pf pf-v5-c-table__action' },
            }
        ], [namespace]);

    return columns;
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

export default RolloutListTab;
