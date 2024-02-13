import { Card, CardBody, CardTitle, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import * as React from 'react';
import { GitAppSetGenerator } from 'src/applicationset/model/ApplicationSetModel';

interface GitGeneratorProps {
    generator: GitAppSetGenerator
}

export const GitGeneratorFragment: React.FC<GitGeneratorProps> = ({ generator }) => {
    return (
        <Card isFlat isRounded>
            <CardTitle>git ({generator.files?"File":"Directory"})</CardTitle>
            <CardBody>
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
            </CardBody>
        </Card>
    )
}
