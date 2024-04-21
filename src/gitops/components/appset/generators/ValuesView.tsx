import { ExpandableSection } from '@patternfly/react-core';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import * as React from 'react';

interface ValuesProps {
    values: Map<string, string>
}

export const ValuesFragment: React.FC<ValuesProps> = ({ values }) => {

    const [isExpanded, setIsExpanded] = React.useState(false);

    const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };

    return (
        <ExpandableSection toggleText={Object.keys(values).length  + " Values"} onToggle={onToggle} isExpanded={isExpanded}>
            <Table variant="compact">
                <Tbody>
                    {
                        Object.keys(values).map( (key) => {
                            return (
                                <Tr><Td>{key}</Td><Td>{values[key]}</Td></Tr>
                            )
                        })
                    }
                </Tbody>
            </Table>
        </ExpandableSection>
    )
}
