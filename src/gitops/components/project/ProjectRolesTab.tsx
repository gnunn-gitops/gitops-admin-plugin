import * as React from 'react';

import { RowProps, TableColumn, TableData, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router';
import { sortable } from '@patternfly/react-table';
import { List, ListItem, PageSection } from '@patternfly/react-core';
import { AppProjectKind, Role } from '@gitops-models/AppProjectModel';

type ProjectRolesProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: AppProjectKind;
};

const ProjectRolesTab: React.FC<ProjectRolesProps> = ({ obj }) => {

    //const { t } = useGitOpsTranslation();

    var roles: Role[];
    if (obj?.spec?.roles) {
        roles = obj.spec.roles;
    } else {
        roles = [];
    }

    return (
        <div>
            <PageSection>
                <VirtualizedTable
                    data={roles}
                    unfilteredData={roles}
                    loaded={true}
                    loadError={null}
                    columns={useRolesColumns()}
                    Row={rolesListRow}
                />
            </PageSection>
        </div>
    )
}

const rolesListRow: React.FC<RowProps<Role>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs} >
                {obj.name}
            </TableData>
            <TableData id="description" activeColumnIDs={activeColumnIDs}>
                {obj.description}
            </TableData>
            <TableData id="groups" activeColumnIDs={activeColumnIDs}>
                {obj.groups &&
                    <List isPlain isBordered>
                    {obj.groups.map(el=> <ListItem>{el}</ListItem>)}
                    </List>
                }
            </TableData>
            <TableData id="policies" activeColumnIDs={activeColumnIDs}>
                {obj.policies &&
                    <List isPlain isBordered>
                    {obj.policies.map(el=> <ListItem>{el}</ListItem>)}
                    </List>
                }
            </TableData>
        </>
    );
};

export const useRolesColumns = () => {

    const columns: TableColumn<Role>[] = React.useMemo(
        () => [
            {
                title: 'Name',
                id: 'name',
                transforms: [sortable],
                sort: `name`
            },
            {
                title: 'Description',
                id: 'description',
                transforms: [sortable],
                sort: `description`
            },
            {
                title: 'Groups',
                id: 'groups'
            },
            {
                title: 'Policies',
                id: 'policies'
            }
        ],
        [],
    );

    return columns;
};

export default ProjectRolesTab;
