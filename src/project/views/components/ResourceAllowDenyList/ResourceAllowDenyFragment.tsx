import * as React from 'react';

import { RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { ResourceAllowDeny } from '@appproject-model';

interface ResourceAllowDenyListProps {
    list: ResourceAllowDeny[]
}

const ResourceAllowDenyListFragment: React.FC<ResourceAllowDenyListProps> = ({ list }) => {
    return (
        <>
            <VirtualizedTable
                data={list}
                unfilteredData={list}
                loaded={true}
                loadError={null}
                columns={useResourceAllowDenyColumns()}
                Row={resourceAllowDenyListRow}
            />
        </>
    )
}

const resourceAllowDenyListRow: React.FC<RowProps<ResourceAllowDeny>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="kind" activeColumnIDs={activeColumnIDs}>
                {obj.kind}
            </TableData>
            <TableData id="group" activeColumnIDs={activeColumnIDs}>
                {obj.group}
            </TableData>
        </>
    );
};

export const useResourceAllowDenyColumns = () => {

    const columns: TableColumn<ResourceAllowDeny>[] = React.useMemo(
        () => [
            {
                title: 'Kind',
                id: 'kind'
            },
            {
                title: 'Group',
                id: 'group'
            }
        ],
        [],
    );

    return columns;
};

export default ResourceAllowDenyListFragment;