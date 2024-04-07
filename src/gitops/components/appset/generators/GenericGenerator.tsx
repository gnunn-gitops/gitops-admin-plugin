import * as React from 'react';
import GeneratorView from './GeneratorView';

interface GenericGeneratorProps {
    gentype: string,
    generator: Object
}

export const GenericGeneratorFragment: React.FC<GenericGeneratorProps> = ({ gentype, generator }) => {

    return (
        <GeneratorView title={gentype}>
            <span>This is an unknown type of Generator</span>
        </GeneratorView>
    )
}
