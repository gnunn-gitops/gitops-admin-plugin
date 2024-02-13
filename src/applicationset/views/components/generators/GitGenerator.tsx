import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import * as React from 'react';
import { GitAppSetGenerator } from 'src/applicationset/model/ApplicationSetModel';
import GeneratorView from './GeneratorView';
import {GitAltIcon} from '@patternfly/react-icons'

interface GitGeneratorProps {
    generator: GitAppSetGenerator
}

export const GitGeneratorFragment: React.FC<GitGeneratorProps> = ({ generator }) => {
    return (
        <GeneratorView icon={<GitAltIcon size="md"/>} title={"git (" + (generator.files?"File":"Directory") + ")"}>
            <DescriptionList isHorizontal isCompact>
                <DescriptionListGroup>
                    <DescriptionListTerm>Repository</DescriptionListTerm>
                    <DescriptionListDescription>{generator.repoURL}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Revision</DescriptionListTerm>
                    <DescriptionListDescription>{generator.revision}</DescriptionListDescription>
                </DescriptionListGroup>
            </DescriptionList>
        </GeneratorView>
    )
}
