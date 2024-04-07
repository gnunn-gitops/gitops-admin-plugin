import * as React from 'react';
import GeneratorView from './GeneratorView';
import {ListIcon} from '@patternfly/react-icons'
import { ListAppSetGenerator } from '@gitops-models/ApplicationSetModel';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ExpandableSection } from '@patternfly/react-core';

interface ListGeneratorProps {
    generator: ListAppSetGenerator
}

export const ListGeneratorFragment: React.FC<ListGeneratorProps> = ({ generator }) => {

    const [isExpanded, setIsExpanded] = React.useState(false);

    const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };

    const displayValue = (value: any) => {
        if (value === undefined) return "null"
        else if (typeof value === "object") return JSON.stringify(value)
        else return value;
    }

    return (
        <GeneratorView icon={<ListIcon/>} title="List">
            <ExpandableSection toggleText={generator.elements.length + " element(s) in list"} onToggle={onToggle} isExpanded={isExpanded}>
                <Table>
                    <Thead noWrap>
                        <Tr>
                            {Object.keys(generator.elements[0]).map((key) => {
                                return (<Th>{key}</Th>)
                            })}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {generator.elements.map((item) => {
                        return (
                            <Tr>
                            {Object.values(item).map((val) => {
                                return (<Td>{displayValue(val)}</Td>)
                            })}
                            </Tr>
                        )
                    })}
                    </Tbody>
                </Table>
            </ExpandableSection>
        </GeneratorView>
    )
}
