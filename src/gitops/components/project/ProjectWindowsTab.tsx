import * as React from 'react';

import { RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router';
import { sortable } from '@patternfly/react-table';
import { List, ListItem, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { AppProjectKind, SyncWindow } from '@gitops-models/AppProjectModel';

type AppProjectWindowsProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: AppProjectKind;
};

const ProjectWindowsTab: React.FC<AppProjectWindowsProps> = ({ obj }) => {

    //const { t } = useGitOpsTranslation();

    var windows: SyncWindow[];
    if (obj?.spec?.syncWindows) {
        windows = obj.spec.syncWindows;
    } else {
        windows = [];
    }

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <VirtualizedTable
                    data={windows}
                    unfilteredData={windows}
                    loaded={true}
                    loadError={null}
                    columns={useWindowsColumns()}
                    Row={windowsListRow}
                />
            </PageSection>
        </div>
    )
}

const windowsListRow: React.FC<RowProps<SyncWindow>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="kind" activeColumnIDs={activeColumnIDs} >
                {obj.kind}
            </TableData>
            <TableData id="schedule" activeColumnIDs={activeColumnIDs}>
                {obj.schedule}
            </TableData>
            <TableData id="duration" activeColumnIDs={activeColumnIDs}>
                {obj.duration}
            </TableData>
            <TableData id="applications" activeColumnIDs={activeColumnIDs}>
                {obj.applications &&
                    <List isPlain isBordered>
                    {obj.applications.map(el=> <ListItem>{el}</ListItem>)}
                    </List>
                }
            </TableData>
            <TableData id="namespaces" activeColumnIDs={activeColumnIDs}>
                {obj.applications &&
                    <List isPlain isBordered>
                    {obj.namespaces.map(el=> <ListItem>{el}</ListItem>)}
                    </List>
                }
            </TableData>
            <TableData id="clusters" activeColumnIDs={activeColumnIDs}>
                {obj.applications &&
                    <List isPlain isBordered>
                    {obj.clusters.map(el=> <ListItem>{el}</ListItem>)}
                    </List>
                }
            </TableData>
            <TableData id="manualSync" activeColumnIDs={activeColumnIDs}>
                {obj.manualSync?obj.manualSync:"False"}
            </TableData>
        </>
    );
};

export const useWindowsColumns = () => {

    const columns: TableColumn<SyncWindow>[] = React.useMemo(
        () => [
            {
                title: 'Kind',
                id: 'kind',
                transforms: [sortable],
                sort: `kind`
            },
            {
                title: 'Schedule',
                id: 'schedule',
                transforms: [sortable],
                sort: `schedule`
            },
            {
                title: 'Duration',
                id: 'duration',
                transforms: [sortable],
                sort: `duration`
            },
            {
                title: 'Applications',
                id: 'applications'
            },
            {
                title: 'Namespaces',
                id: 'namespaces'
            },
            {
                title: 'Clusters',
                id: 'clusters'
            },
            {
                title: 'Manual Sync',
                id: 'manualSync',
                transforms: [sortable],
                sort: `manualSync`
            }
        ],
        [],
    );

    return columns;
};

export default ProjectWindowsTab;
