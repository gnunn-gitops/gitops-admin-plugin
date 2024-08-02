import * as React from 'react';

import { ApplicationSource } from '@gitops-models/ApplicationModel';
import { RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import ExternalLink from '@gitops-shared/ExternalLink';

import './Sources.scss';
import { repoUrl, revisionUrl } from '@gitops-utils/urls';

interface SourceListProps {
    sources: ApplicationSource[]
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {

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
            <TableData id="type" activeColumnIDs={activeColumnIDs} className='gitops-admin-plugin__sources-type-column'>
                <img src={(obj.chart ? require("@images/helm.png"): require("@images/git.png"))} alt={(obj.chart ? "Helm": "Git")} width="19px" height="24px" />
            </TableData>
            <TableData id="repository" activeColumnIDs={activeColumnIDs}>
                <ExternalLink href={obj.repoURL}>
                    {repoUrl(obj.repoURL)}
                </ExternalLink>
            </TableData>
            <TableData id="chart" activeColumnIDs={activeColumnIDs}>
                {obj.chart || '-'}
            </TableData>
            <TableData id="path" activeColumnIDs={activeColumnIDs}>
                {obj.chart ?
                  obj.path
                :
                <ExternalLink href={revisionUrl(obj.repoURL, obj.targetRevision, true) + "/" + obj.path }>
                    {obj.path}
                </ExternalLink>
                }
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
                transforms: [],
                props: { className: 'gitops-admin-plugin__sources-type-column' }
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

export default SourceList;
