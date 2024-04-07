import * as React from 'react';
import GeneratorView from './GeneratorView';
import {ThLargeIcon} from '@patternfly/react-icons'
import { MatrixAppSetGenerator } from '@gitops-models/ApplicationSetModel';
import Generators from '../Generators';

interface MatrixGeneratorProps {
    generator: MatrixAppSetGenerator
}

export const MatrixGeneratorFragment: React.FC<MatrixGeneratorProps> = ({ generator }) => {
    return (
        <>
            <GeneratorView icon={<ThLargeIcon/>} title="Matrix"/>
            <br/>
            <div style={{marginLeft: "32px"}}>
                <Generators generators={generator.generators}/>
            </div>
        </>
    )
}
