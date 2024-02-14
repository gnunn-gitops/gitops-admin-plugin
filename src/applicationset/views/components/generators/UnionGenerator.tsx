import * as React from 'react';
import GeneratorView from './GeneratorView';
import {UnityIcon} from '@patternfly/react-icons'
import { UnionAppSetGenerator } from 'src/applicationset/model/ApplicationSetModel';
import Generators from '../generators';

interface UnionGeneratorProps {
    generator: UnionAppSetGenerator
}

export const UnionGeneratorFragment: React.FC<UnionGeneratorProps> = ({ generator }) => {
    return (
        <>
            <GeneratorView icon={<UnityIcon size="md"/>} title="Union"/>
            <br/>
            <div style={{marginLeft: "32px"}}>
                <Generators generators={generator.generators}/>
            </div>
        </>
    )
}
