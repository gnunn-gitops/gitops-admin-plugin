import * as React from 'react';

import { RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { Destination } from '@appproject-model';

interface DestinationListProps {
    destinations: Destination[]
}

const DestinationsListFragment: React.FC<DestinationListProps> = ({ destinations }) => {

    if (!destinations) destinations=[]

    return (
        <VirtualizedTable
            data={destinations}
            unfilteredData={destinations}
            loaded={true}
            loadError={null}
            columns={useDestinationsColumns()}
            Row={destinationsListRow}
            aria-label='destinations'
        />
    )
}

const destinationsListRow: React.FC<RowProps<Destination>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="server" activeColumnIDs={activeColumnIDs}>
                {obj.server || '-'}
            </TableData>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                {obj.name}
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                {obj.namespace}
            </TableData>
        </>
    );
};

export const useDestinationsColumns = () => {

    const columns: TableColumn<Destination>[] = React.useMemo(
        () => [
            {
                title: 'Server',
                id: 'server',
                transforms: [sortable],
                sort: 'server',
            },
            {
                title: 'Name',
                id: 'name',
                transforms: [sortable],
                sort: 'name',
            },
            {
                title: 'Namespace',
                id: 'namespace',
                transforms: [sortable],
                sort: 'namespace',
            }
        ],
        [],
    );

    return columns;
};

export default DestinationsListFragment;