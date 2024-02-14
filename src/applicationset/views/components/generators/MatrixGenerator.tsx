import * as React from 'react';
import GeneratorView from './GeneratorView';
import {ThLargeIcon} from '@patternfly/react-icons'
import { MatrixAppSetGenerator } from 'src/applicationset/model/ApplicationSetModel';
import Generators from '../generators';

interface MatrixGeneratorProps {
    generator: MatrixAppSetGenerator
}

export const MatrixGeneratorFragment: React.FC<MatrixGeneratorProps> = ({ generator }) => {
    return (
        <>
            <GeneratorView icon={<ThLargeIcon size="md"/>} title="Matrix"/>
            <br/>
            <div style={{marginLeft: "32px"}}>
                <Generators generators={generator.generators}/>
            </div>
        </>
    )
}
