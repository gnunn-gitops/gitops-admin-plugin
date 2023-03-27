import * as React from 'react';

import { ApplicationHistory } from '@application-model';
import { RowProps, TableColumn, TableData, Timestamp, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import RevisionFragment from '../Revision/RevisionFragment';

interface HistoryListProps {
    history: ApplicationHistory[]
}

const HistoryListFragment: React.FC<HistoryListProps> = ({ history }) => {

    return (
        <>
            <VirtualizedTable
                data={history}
                unfilteredData={history}
                loaded={true}
                loadError={null}
                columns={useHistoryColumns()}
                Row={historyListRow}
            />
        </>
    )
}

const historyListRow: React.FC<RowProps<ApplicationHistory>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="id" activeColumnIDs={activeColumnIDs} >
                {obj.id}
            </TableData>
            <TableData id="deployStartedAt" activeColumnIDs={activeColumnIDs}>
                <Timestamp timestamp={obj.deployStartedAt} />
            </TableData>
            <TableData id="deployedAt" activeColumnIDs={activeColumnIDs}>
            <Timestamp timestamp={obj.deployedAt} />
            </TableData>
            <TableData id="revision" activeColumnIDs={activeColumnIDs}>
                <RevisionFragment
                    revision={obj.revision || ''}
                    repoURL={obj.source.repoURL}
                  />
            </TableData>
            {/* <TableData id="source" activeColumnIDs={activeColumnIDs}>
                <DescriptionList isCompact isHorizontal>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Repository</DescriptionListTerm>
                        <DescriptionListDescription>{obj.source.repoURL}</DescriptionListDescription>
                    </DescriptionListGroup>

                    <DescriptionListGroup>
                        <DescriptionListTerm>Path</DescriptionListTerm>
                        <DescriptionListDescription>{obj.source.path}</DescriptionListDescription>
                    </DescriptionListGroup>

                    <DescriptionListGroup>
                        <DescriptionListTerm>Revision</DescriptionListTerm>
                        <DescriptionListDescription>{obj.source.targetRevision}</DescriptionListDescription>
                    </DescriptionListGroup>
                </DescriptionList>
            </TableData> */}
        </>
    );
};

export const useHistoryColumns = () => {

    const columns: TableColumn<ApplicationHistory>[] = React.useMemo(
        () => [
            {
                title: 'ID',
                id: 'id',
                transforms: [sortable],
                sort: `id`
            },
            {
                title: 'Deploy Started At',
                id: 'deployStartedAt',
                transforms: [sortable],
                sort: `deployStartedAt`
            },
            {
                title: 'Deployed At',
                id: 'deployedAt',
                transforms: [sortable],
                sort: 'deployedAt'
            },
            {
                title: 'Revision',
                id: 'revision',
                transforms: [sortable],
                sort: 'revision'
            }
            // {
            //     title: 'Source',
            //     sort: 'source',
            //     id: 'source',
            //     transforms: []
            // }
        ],
        [],
    );

    return columns;
};

export default HistoryListFragment;
