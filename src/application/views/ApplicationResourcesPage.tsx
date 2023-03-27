import * as React from 'react';

import { ApplicationKind, ApplicationResourceStatus } from '@application-model';
import { K8sGroupVersionKind, ResourceLink, RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router';
import { sortable } from '@patternfly/react-table';
import SyncStatusFragment from './components/Statuses/SyncStatusFragment';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ApplicationResourcesPageProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: ApplicationKind;
};

const ApplicationResourcesPage: React.FC<ApplicationResourcesPageProps> = ({ obj }) => {

    const { t } = useGitOpsTranslation();

    var resources: ApplicationResourceStatus[];
    if (obj?.status?.resources) {
        resources = obj?.status?.resources;
    }

    return (
        <div>
            <PageSection>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Application resources')}
                </Title>

                <VirtualizedTable
                    data={resources}
                    unfilteredData={resources}
                    loaded={true}
                    loadError={null}
                    columns={useResourceColumns()}
                    Row={applicationListRow}
                />
            </PageSection>
        </div>
    )
}

const applicationListRow: React.FC<RowProps<ApplicationResourceStatus>> = ({ obj, activeColumnIDs }) => {

    const gvk : K8sGroupVersionKind = {
        version: obj.version,
        group: obj.group,
        kind: obj.kind
    }

    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs} >
            <ResourceLink
                groupVersionKind={gvk}
                name={obj.name}
                namespace={obj.namespace}
            />
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                {obj.namespace}
            </TableData>
            <TableData id="group" activeColumnIDs={activeColumnIDs}>
                { (obj.group? obj.group + "/":"") + obj.kind}
            </TableData>
            <TableData id="syncWave" activeColumnIDs={activeColumnIDs}>
                {obj.syncWave}
            </TableData>
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                <SyncStatusFragment
                    status={obj.status}
                />
            </TableData>
        </>
    );
};

export const useResourceColumns = () => {

    const columns: TableColumn<ApplicationResourceStatus>[] = React.useMemo(
        () => [
            {
                title: 'Name',
                id: 'name',
                transforms: [sortable],
                sort: `name`
            },
            {
                title: 'Namespace',
                id: 'namespace',
                transforms: [sortable],
                sort: `namespace`
            },
            {
                title: 'Group/Kind',
                id: 'group',
                transforms: [sortable],
                sort: `group`
            },
            {
                title: 'Sync Order',
                id: 'syncWave',
                transforms: [sortable],
                sort: 'syncWave'
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: 'status'
            }
        ],
        [],
    );

    return columns;
};

export default ApplicationResourcesPage;
