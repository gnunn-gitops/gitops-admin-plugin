import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import * as React from 'react';

interface GenericGeneratorProps {
    gentype: string,
    generator: Object

}

export const GenericGeneratorFragment: React.FC<GenericGeneratorProps> = ({ gentype, generator }) => {

    return (
        <Card isFlat isRounded>
            <CardTitle>{gentype}</CardTitle>,
            <CardBody>Unknown Generator</CardBody>
        </Card>
    )
}
