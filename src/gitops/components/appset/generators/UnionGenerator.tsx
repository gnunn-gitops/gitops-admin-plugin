import * as React from 'react';
import GeneratorView from './GeneratorView';
import {UnityIcon} from '@patternfly/react-icons'
import { UnionAppSetGenerator } from '@gitops-models/ApplicationSetModel';
import Generators from '../Generators';

interface UnionGeneratorProps {
    generator: UnionAppSetGenerator
}

export const UnionGeneratorFragment: React.FC<UnionGeneratorProps> = ({ generator }) => {
    return (
        <>
            <GeneratorView icon={<UnityIcon/>} title="Union"/>
            <br/>
            <div style={{marginLeft: "32px"}}>
                <Generators generators={generator.generators}/>
            </div>
        </>
    )
}
