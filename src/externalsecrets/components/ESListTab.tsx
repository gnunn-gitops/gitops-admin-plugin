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
import { getStatus, getTargetSecretName } from '../utils/es-utils';

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
    const [data, filteredData, onFilterChange] = useListPageFilter(externalSecrets);

    return (
        <>
            {showTitle == undefined &&
                <ListPageHeader title={'ExternalSecrets'}>
                    <ListPageCreate groupVersionKind={modelToRef(ExternalSecretModel)}>Create Project</ListPageCreate>
                </ListPageHeader>
            }
            <ListPageBody>
                {!hideNameLabelFilters &&
                    <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
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
        version: "v1",
        group: "",
        kind: "Secret"
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
            <TableData id="secret" activeColumnIDs={activeColumnIDs}>
                <ResourceLink
                  groupVersionKind={gvk}
                  name={getTargetSecretName(obj)}
                  namespace={obj.metadata.namespace}
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
                title: 'Secret',
                id: 'secret',
                transforms: [sortable],
                sort: (data, direction) => data.sort((es1, es2) => {
                    const sn1 = getTargetSecretName(es1 as ExternalSecretKind)
                    const sn2 = getTargetSecretName(es2 as ExternalSecretKind)

                    return (direction==SortByDirection.asc) ? sn1.localeCompare(sn2) : sn2.localeCompare(sn1);
                })
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: (data, direction) => data.sort((es1, es2) => {
                    const sn1 = getStatus(es1 as ExternalSecretKind).code
                    const sn2 = getStatus(es2 as ExternalSecretKind).code

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

export default ESListTab;
