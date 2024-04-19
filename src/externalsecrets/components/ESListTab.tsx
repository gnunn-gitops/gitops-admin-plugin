import * as React from 'react';
import { ExternalSecretKind, ExternalSecretModel } from '@es-models/ExternalSecrets';
import { modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
import {
    Action,
    K8sGroupVersionKind,
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
import { SortByDirection, sortable } from '@patternfly/react-table';
import ActionsDropdown from '@utils/components/ActionDropDown/ActionDropDown'
import ESStatus from './ESStatus';
import { useESActionsProvider } from './hooks/useESActionsProvider';
import { ConditionReason, getStatus } from '../utils/es-utils';

type ESListTabProps = {
    namespace: string;
    hideNameLabelFilters?: boolean;
    showTitle?: boolean;
};

const ESListTab: React.FC<ESListTabProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
    const [externalSecrets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
        isList: true,
        groupVersionKind: {
            group: 'external-secrets.io',
            kind: 'ExternalSecret',
            version: 'v1beta1',
        },
        namespaced: true,
        namespace,
    });
    // const { t } = useTranslation();
    const columns = useESColumns(namespace);
    const [data, filteredData, onFilterChange] = useListPageFilter(externalSecrets, filters);

    return (
        <>
            {showTitle == undefined &&
                <ListPageHeader title={'ExternalSecrets'}>
                    <ListPageCreate groupVersionKind={modelToRef(ExternalSecretModel)}>Create Project</ListPageCreate>
                </ListPageHeader>
            }
            <ListPageBody>
                {!hideNameLabelFilters &&
                    <ListPageFilter data={data} loaded={loaded} rowFilters={filters} onFilterChange={onFilterChange} />
                }
                <VirtualizedTable<K8sResourceCommon>
                    data={filteredData}
                    unfilteredData={externalSecrets}
                    loaded={loaded}
                    loadError={loadError}
                    columns={columns}
                    Row={appProjectListRow}
                />
            </ListPageBody>
        </>
    );
};

const appProjectListRow: React.FC<RowProps<ExternalSecretKind>> = ({ obj, activeColumnIDs }) => {

    const actionList: [actions: Action[]] = useESActionsProvider(obj);
    const gvk: K8sGroupVersionKind = {
        version: "v1beta1",
        group: "external-secrets.io",
        kind: obj.spec.secretStoreRef.kind ? obj.spec.secretStoreRef.kind : "SecretStore"
    }

    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                <ResourceLink
                    groupVersionKind={modelToGroupVersionKind(ExternalSecretModel)}
                    name={obj.metadata.name}
                    namespace={obj.metadata.namespace}
                />
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
            </TableData>
            <TableData id="store" activeColumnIDs={activeColumnIDs}>
                <ResourceLink
                  groupVersionKind={gvk}
                  name={obj.spec.secretStoreRef.name}
                  namespace={gvk.kind == "SecretStore" ? obj.metadata.namespace : null}
                />
            </TableData>
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                <ESStatus externalSecret={obj}/>
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-v5-c-table__action"
            >
                <ActionsDropdown
                    actions={actionList ? actionList[0] : []}
                    id="gitops-project-actions"
                    isKebabToggle={true}
                />

            </TableData>
        </>
    );
};

const useESColumns = (namespace) => {

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
                title: 'Store',
                id: 'store',
                transforms: [sortable],
                sort: 'spec.secretStoreRef.name'
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: (data, direction) => data.sort((es1, es2) => {
                    const sn1 = getStatus(es1 as ExternalSecretKind).reason
                    const sn2 = getStatus(es2 as ExternalSecretKind).reason

                    return (direction==SortByDirection.asc) ? sn1.localeCompare(sn2) : sn2.localeCompare(sn1);
                })
            },
            {
                title: '',
                id: 'actions',
                props: { className: 'dropdown-kebab-pf pf-v5-c-table__action' },
            }
        ], [namespace]);

    return columns;
};

export const filters: RowFilter[] = [
    {
        filterGroupName: 'Status',
        type: 'es-status',
        reducer: (es) => (getStatus(es).reason),
        filter: (input, es) => {
            if (input.selected?.length) {
                return input.selected.includes(getStatus(es).reason);
            } else {
                return true;
            }
        },
        items: [
            { id: ConditionReason.SecretSynced, title: ConditionReason.SecretSynced },
            { id: ConditionReason.SecretSyncedError, title: ConditionReason.SecretSyncedError },
            { id: ConditionReason.Updated, title: ConditionReason.Updated },
            { id: ConditionReason.UpdateFailed, title: ConditionReason.UpdateFailed },
            { id: ConditionReason.InvalidStoreRef, title: ConditionReason.InvalidStoreRef },
            { id: ConditionReason.InvalidProviderClientConfig, title: ConditionReason.InvalidProviderClientConfig },
            { id: ConditionReason.SecretDeleted, title: ConditionReason.SecretDeleted },
            { id: ConditionReason.Unknown, title: ConditionReason.Unknown },
],
    }
];

export default ESListTab;
