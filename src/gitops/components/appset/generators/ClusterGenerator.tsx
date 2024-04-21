import * as React from 'react';
import GeneratorView from './GeneratorView';
import {ClusterIcon} from '@patternfly/react-icons'

import { ClusterAppSetGenerator } from '@gitops-models/ApplicationSetModel';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { ValuesFragment } from './ValuesView';

interface ClusterGeneratorProps {
    generator: ClusterAppSetGenerator
}

export const ClusterGeneratorFragment: React.FC<ClusterGeneratorProps> = ({ generator }) => {

    console.log("Selector");
    console.log(generator.selector);

    return (
        <GeneratorView icon={<ClusterIcon/>} title="Cluster">
            {generator.selector &&
                <>
                    <DescriptionList isHorizontal isCompact>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Selector</DescriptionListTerm>
                            <DescriptionListDescription>
                                {JSON.stringify(generator.selector)}
                            </DescriptionListDescription>
                        </DescriptionListGroup>
                    </DescriptionList>
                    <br/>
                </>
            }
            {generator.values &&
                <ValuesFragment values={generator.values}/>
            }
        </GeneratorView>
    )
}
