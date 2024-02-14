import * as React from 'react';
import GeneratorView from './GeneratorView';
import {ListIcon} from '@patternfly/react-icons'
import { ListAppSetGenerator } from 'src/applicationset/model/ApplicationSetModel';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ExpandableSection } from '@patternfly/react-core';

interface ListGeneratorProps {
    generator: ListAppSetGenerator
}

export const ListGeneratorFragment: React.FC<ListGeneratorProps> = ({ generator }) => {

    const [isExpanded, setIsExpanded] = React.useState(false);

    const onToggle = (isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };

    const displayValue = (value: any) => {
        if (value === undefined) return "null"
        else if (typeof value === "object") return JSON.stringify(value)
        else return value;
    }

    return (
        <GeneratorView icon={<ListIcon size="md"/>} title="List">
            <ExpandableSection toggleText={generator.elements.length + "elements in list"} onToggle={onToggle} isExpanded={isExpanded}>
                <TableComposable>
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
                </TableComposable>
            </ExpandableSection>
        </GeneratorView>
    )
}
