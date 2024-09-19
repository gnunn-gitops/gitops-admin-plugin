import * as React from 'react';
import { CertificateKind, CertificateModel } from '@cert-models/Certificates';
import { modelToGroupVersionKind, modelToRef } from '@gitops-utils/utils';
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
import CertStatus from './CertStatus';
import { useCertActionsProvider } from './hooks/useCertActionsProvider';
import { ConditionReason, getStatus } from '../utils/cert-utils';

type CertListTabProps = {
    namespace: string;
    hideNameLabelFilters?: boolean;
    showTitle?: boolean;
};

const CertListTab: React.FC<CertListTabProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
    const [certificate, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
        isList: true,
        groupVersionKind: {
            group: 'cert-manager.io',
            kind: 'Certificate',
            version: 'v1',
        },
        namespaced: true,
        namespace,
    });
    // const { t } = useTranslation();
    const columns = useCertColumns(namespace);
    const [data, filteredData, onFilterChange] = useListPageFilter(certificate, filters);

    return (
        <>
            {showTitle == undefined &&
                <ListPageHeader title={'Certificates'}>
                    <ListPageCreate groupVersionKind={modelToRef(CertificateModel)}>Create Project</ListPageCreate>
                </ListPageHeader>
            }
            <ListPageBody>
                {!hideNameLabelFilters &&
                    <ListPageFilter data={data} loaded={loaded} rowFilters={filters} onFilterChange={onFilterChange} />
                }
                <VirtualizedTable<K8sResourceCommon>
                    data={filteredData}
                    unfilteredData={certificate}
                    loaded={loaded}
                    loadError={loadError}
                    columns={columns}
                    Row={appProjectListRow}
                />
            </ListPageBody>
        </>
    );
};

const appProjectListRow: React.FC<RowProps<CertificateKind>> = ({ obj, activeColumnIDs }) => {

    const actionList: [actions: Action[]] = useCertActionsProvider(obj);


    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                <ResourceLink
                    groupVersionKind={modelToGroupVersionKind(CertificateModel)}
                    name={obj.metadata.name}
                    namespace={obj.metadata.namespace}
                />
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
            </TableData>

            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                <CertStatus certificate={obj}/>
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

const useCertColumns = (namespace) => {

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
                sort: (data, direction) => data.sort((es1, es2) => {
                    const sn1 = getStatus(es1 as CertificateKind).reason
                    const sn2 = getStatus(es2 as CertificateKind).reason

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
        type: 'cert-status',
        reducer: (cert) => (getStatus(cert).reason),
        filter: (input, cert) => {
            if (input.selected?.length) {
                return input.selected.includes(getStatus(cert).reason);
            } else {
                return true;
            }
        },
        items: [
            { id: ConditionReason.Updated, title: ConditionReason.Updated },
            { id: ConditionReason.UpdateFailed, title: ConditionReason.UpdateFailed },
            { id: ConditionReason.Unknown, title: ConditionReason.Unknown },
],
    }
];

export default CertListTab;
