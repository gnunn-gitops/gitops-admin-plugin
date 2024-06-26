import * as React from 'react';
import { getResourceUrl, modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
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
import { SortByDirection, sortable } from '@patternfly/react-table';
import ActionsDropdown from '@utils/components/ActionDropDown/ActionDropDown'
import { ApplicationSetKind, ApplicationSetModel } from '@gitops-models/ApplicationSetModel';
import { useAppSetActionsProvider } from './hooks/useAppSetActionsProvider';
import Status from './Status';
import { getAppSetGeneratorCount, getAppSetStatus } from '@gitops-utils/gitops';
import { ApplicationSetStatus } from '@gitops-utils/constants';
import { Link } from 'react-router-dom-v5-compat';

type AppSetListTabProps = {
    namespace: string;
    hideNameLabelFilters?: boolean;
    showTitle?: boolean;
};

const AppSetListTab: React.FC<AppSetListTabProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
    const [appSets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
        isList: true,
        groupVersionKind: {
            group: 'argoproj.io',
            kind: 'ApplicationSet',
            version: 'v1alpha1',
        },
        namespaced: true,
        namespace,
    });
    // const { t } = useTranslation();
    const columns = useAppSetColumns(namespace);
    const [data, filteredData, onFilterChange] = useListPageFilter(appSets, filters);

    return (
        <>
            {showTitle == undefined &&
                <ListPageHeader title={'ApplicationSets'}>
                    <ListPageCreate groupVersionKind={modelToRef(ApplicationSetModel)}>Create ApplicationSet</ListPageCreate>
                </ListPageHeader>
            }
            <ListPageBody>
                {!hideNameLabelFilters &&
                    <ListPageFilter data={data} loaded={loaded} rowFilters={filters} onFilterChange={onFilterChange} />
                }
                <VirtualizedTable<K8sResourceCommon>
                    data={filteredData}
                    unfilteredData={appSets}
                    loaded={loaded}
                    loadError={loadError}
                    columns={columns}
                    Row={appSetListRow}
                />
            </ListPageBody>
        </>
    );
};

const appSetListRow: React.FC<RowProps<ApplicationSetKind>> = ({ obj, activeColumnIDs }) => {

    const actionList: [actions: Action[]] = useAppSetActionsProvider(obj);

    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                <ResourceLink
                    groupVersionKind={modelToGroupVersionKind(ApplicationSetModel)}
                    name={obj.metadata.name}
                    namespace={obj.metadata.namespace}
                />
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
            </TableData>
            <TableData id='generators' activeColumnIDs={activeColumnIDs}>
                <Link to={getResourceUrl({model:ApplicationSetModel, resource:obj})+"/generators"}>
                    {getAppSetGeneratorCount(obj)}
                </Link>
            </TableData>
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                <Status status={getAppSetStatus(obj)} />
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-v5-c-table__action"
            >
                <ActionsDropdown
                    actions={actionList ? actionList[0] : []}
                    id="gitops-applicationset-actions"
                    isKebabToggle={true}
                />
            </TableData>
        </>
    );
};

const useAppSetColumns = (namespace) => {

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
                title: 'Generators',
                id: 'generators',
                transforms: [sortable],
                sort: (data, direction) => data.sort((appset1, appset2) => {
                    const g1 = getAppSetGeneratorCount(appset1 as ApplicationSetKind)
                    const g2 = getAppSetGeneratorCount(appset2 as ApplicationSetKind)

                    return (direction == SortByDirection.asc) ? (g1 - g2) : (g2 - g1);
                })
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: (data, direction) => data.sort((appset1, appset2) => {
                    const sn1 = getAppSetStatus(appset1 as ApplicationSetKind)
                    const sn2 = getAppSetStatus(appset2 as ApplicationSetKind)

                    return (direction == SortByDirection.asc) ? sn1.localeCompare(sn2) : sn2.localeCompare(sn1);
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
        type: 'appset-status',
        reducer: (appset) => (getAppSetStatus(appset)),
        filter: (input, appset) => {
            if (input.selected?.length) {
                return input.selected.includes(getAppSetStatus(appset));
            } else {
                return true;
            }
        },
        items: [
            { id: ApplicationSetStatus.HEALTHY, title: ApplicationSetStatus.HEALTHY },
            { id: ApplicationSetStatus.ERROR, title: ApplicationSetStatus.ERROR },
            { id: ApplicationSetStatus.UNKNOWN, title: ApplicationSetStatus.UNKNOWN },
        ],
    }
];

export default AppSetListTab;
