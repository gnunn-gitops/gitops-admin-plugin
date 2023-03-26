import * as React from 'react';

import { ApplicationSource } from '@application-model';
import { RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

//import * as  gitIcon from '../../../../images/git.png';
//import * as  helmIcon from '../../../../images/helm.png';

interface SourceListProps {
    sources: ApplicationSource[]
}

const SourceListFragment: React.FC<SourceListProps> = ({ sources }) => {

    console.log(sources);
    return (
        <>
            <VirtualizedTable
                data={sources}
                unfilteredData={sources}
                loaded={true}
                loadError={null}
                columns={useSourcesColumns()}
                Row={sourceListRow}
            />
        </>
    )
}

const sourceListRow: React.FC<RowProps<ApplicationSource>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="type" activeColumnIDs={activeColumnIDs} className={"icon-column"}  >
                <img loading="lazy" src={(obj.chart ? require("../../../../images/helm.png"): require("../../../../images/git.png"))} alt={(obj.chart ? "Helm": "Git")} width="19px" height="24px" />
            </TableData>
            <TableData id="repository" activeColumnIDs={activeColumnIDs}>
                {obj.repoURL}
            </TableData>
            <TableData id="chart" activeColumnIDs={activeColumnIDs}>
                {obj.chart || '-'}
            </TableData>
            <TableData id="path" activeColumnIDs={activeColumnIDs}>
                {obj.path}
            </TableData>
            <TableData id="targetRevision" activeColumnIDs={activeColumnIDs}>
                {obj.targetRevision}
            </TableData>
        </>
    );
};

export const useSourcesColumns = () => {

    const columns: TableColumn<ApplicationSource>[] = React.useMemo(
        () => [
            {
                title: 'Type',
                id: 'type',
                transforms: []
            },
            {
                title: 'Repository',
                id: 'repository',
                transforms: [sortable],
                sort: 'repository',
            },
            {
                title: 'Chart',
                id: 'chart',
                transforms: [sortable],
                sort: 'chart',
            },
            {
                title: 'Path',
                id: 'path',
                transforms: [sortable],
                sort: 'path',
            },
            {
                title: 'Target Revision',
                sort: 'targetRevision',
                id: 'targetRevision',
                transforms: [sortable],
            }
        ],
        [],
    );

    return columns;
};

export default SourceListFragment;
