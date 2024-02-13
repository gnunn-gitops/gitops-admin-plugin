import { Card, CardBody, CardTitle, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import * as React from 'react';

interface GitGeneratorProps {
    generator: any
}

export const GitGeneratorFragment: React.FC<GitGeneratorProps> = ({ generator }) => {
    return (
        <Card isFlat isRounded>
            <CardTitle>git</CardTitle>
            <CardBody>
                <DescriptionList isHorizontal>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Repository</DescriptionListTerm>
                        <DescriptionListDescription>{generator.git.repoURL}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Revision</DescriptionListTerm>
                        <DescriptionListDescription>{generator.git.revision}</DescriptionListDescription>
                    </DescriptionListGroup>
                </DescriptionList>
            </CardBody>
        </Card>
    )
}
