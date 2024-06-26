import * as React from 'react';
import { Action, K8sResourceCommon, ListPageBody, ListPageCreate, ListPageFilter, ListPageHeader, ResourceLink, RowFilter, RowProps, TableColumn, TableData, VirtualizedTable, useK8sWatchResource, useListPageFilter } from "@openshift-console/dynamic-plugin-sdk";
import { modelToGroupVersionKind, modelToRef } from 'src/gitops/utils/utils';
import { ApplicationKind, ApplicationModel } from '@gitops-models/ApplicationModel';
import { HealthStatus, SyncStatus } from 'src/gitops/utils/constants';
import { Flex, FlexItem, Spinner } from '@patternfly/react-core';
import SyncStatusFragment from '../application/Statuses/SyncStatus';
import { OperationState } from '../application/Statuses/OperationState';
import HealthStatusFragment from '../application/Statuses/HealthStatus';
import RevisionFragment from '../application/Revision/Revision';
//import ApplicationRowActions from './ApplicationRowActions';
import { AppProjectKind } from '@gitops-models/AppProjectModel';
import { isApplicationRefreshing } from 'src/gitops/utils/gitops';
import { sortable } from '@patternfly/react-table'
import { useApplicationActionsProvider } from '../application/hooks/useApplicationActionsProvider';
import ActionsDropdown from '@utils/components/ActionDropDown/ActionDropDown'

interface ApplicationProps {
    namespace: string;
    // Here to support plugging in view in Projects (i.e. show list of apps that belong to project)
    // Needs the console API to support defining your own static filter though since neither a label
    // or a field-selector is available to select just the project apps based on k8s watch api.
    project?: AppProjectKind;
    appset?: K8sResourceCommon;
    hideNameLabelFilters?: boolean;
    showTitle?: boolean;
}

function filterApp(project: AppProjectKind, appset: K8sResourceCommon) {
    return function (app: ApplicationKind) {

        if (project != undefined) {
            return (app.spec.project == project.metadata.name)
        } else if (appset != undefined) {
            if (app.metadata.ownerReferences == undefined) return false;
            var matched: boolean = false;
            app.metadata.ownerReferences.forEach((owner) => {
                console.log("Compare:" + owner.kind + "," + owner.name + "=" + appset.kind + "," + appset.metadata.name);
                matched = (owner.kind == appset.kind && owner.name == appset.metadata.name)
                if (matched) return;
            });
            return matched;
        }
        return true;
    }
}

const ApplicationList: React.FC<ApplicationProps> = ({ namespace, project, appset, hideNameLabelFilters, showTitle }) => {

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
            {(showTitle == undefined && (project == undefined || appset == undefined)) &&
                <ListPageHeader title={'Applications'}>
                    <ListPageCreate groupVersionKind={modelToRef(ApplicationModel)}>Create Application</ListPageCreate>
                </ListPageHeader>
            }
            <ListPageBody>
                {!hideNameLabelFilters &&
                    <ListPageFilter
                        data={data.filter(filterApp(project, appset))}
                        loaded={loaded}
                        rowFilters={filters}
                        onFilterChange={onFilterChange}
                    />
                }
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

    const actionList: [actions: Action[]] = useApplicationActionsProvider(obj);

    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs} >
                <ResourceLink
                    groupVersionKind={modelToGroupVersionKind(ApplicationModel)}
                    name={obj.metadata.name}
                    namespace={obj.metadata.namespace}
                    inline={true}
                >
                    <span className="pf-u-pl-sm">{isApplicationRefreshing(obj) && <Spinner size='sm' />}</span>
                </ResourceLink>
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
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
                        <OperationState app={obj} quiet={true} />
                    </FlexItem>
                </Flex>
            </TableData>
            <TableData id="health-status" activeColumnIDs={activeColumnIDs}>
                <HealthStatusFragment
                    status={obj.status?.health?.status || ''}
                />
            </TableData>
            <TableData id="revision" activeColumnIDs={activeColumnIDs}>
                {obj?.spec?.source?.targetRevision?obj?.spec?.source?.targetRevision:"HEAD"}&nbsp;
                (<RevisionFragment
                    revision={obj.status?.sync?.revision || ''}
                    repoURL={obj.spec.source?.repoURL}
                    helm={obj.status?.sourceType == "Helm"}
                />)
            </TableData>
            <TableData id="project" activeColumnIDs={activeColumnIDs}>
                {obj.spec?.project &&
                    <ResourceLink groupVersionKind={{ group: 'argoproj.io', version: 'v1alpha1', kind: 'AppProject' }} name={obj.spec.project}/>
                }
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-v5-c-table__action"
            >
                <ActionsDropdown
                    actions={actionList ? actionList[0] : []}
                    id="gitops-application-actions"
                    isKebabToggle={true}
                />
            </TableData>
        </>
    );
};

const useApplicationColumns = (namespace) => {

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
                sort: 'spec.source.targetRevision',
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
                props: { className: 'dropdown-kebab-pf pf-v5-c-table__action' },
            }
        ], [namespace]);

    return columns;
};

// Need to differentiate between Sync and Health Unknown for filtering
const FilterUnknownStatus: string = 'Sync.' + SyncStatus.UNKNOWN;

export const filters: RowFilter[] = [
    {
        filterGroupName: 'Sync Status',
        type: 'app-sync',
        reducer: (application) => (application.status?.sync?.status == SyncStatus.UNKNOWN? FilterUnknownStatus: application.status?.sync?.status),
        filter: (input, application) => {
            if (input.selected?.length && application?.status?.sync?.status) {
                return input.selected.includes(application.status.sync.status) ||
                  (input.selected.includes(FilterUnknownStatus) && application.status.sync.status == SyncStatus.UNKNOWN)
            } else if (!application?.status?.sync?.status) {
                return false;
            }
            return true;
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

export default ApplicationList;
