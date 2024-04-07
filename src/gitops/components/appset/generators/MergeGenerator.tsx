import * as React from 'react';
import GeneratorView from './GeneratorView';
import {CompressIcon} from '@patternfly/react-icons'
import { MergeAppSetGenerator } from '@gitops-models/ApplicationSetModel';
import Generators from '../Generators';

interface MergeGeneratorProps {
    generator: MergeAppSetGenerator
}

export const MergeGeneratorFragment: React.FC<MergeGeneratorProps> = ({ generator }) => {
    return (
        <>
            <GeneratorView icon={<CompressIcon/>} title="Merge">
                <span>{generator.mergeKeys.length} merge keys</span>
            </GeneratorView>
            <br/>
            <div style={{marginLeft: "32px"}}>
                <Generators generators={generator.generators}/>
            </div>
        </>
    )
}
