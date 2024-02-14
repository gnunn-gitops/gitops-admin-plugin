import * as React from 'react';
import GeneratorView from './GeneratorView';
import {ListIcon} from '@patternfly/react-icons'
import { ListAppSetGenerator } from 'src/applicationset/model/ApplicationSetModel';

interface ListGeneratorProps {
    generator: ListAppSetGenerator
}

export const ListGeneratorFragment: React.FC<ListGeneratorProps> = ({ generator }) => {
    return (
        <GeneratorView icon={<ListIcon size="md"/>} title="List">
            <span>{generator.elements.length} elements in list</span>
        </GeneratorView>
    )
}
