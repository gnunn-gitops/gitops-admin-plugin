import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import React, { ReactNode } from 'react';

type GeneratorViewProps = {
    title: string,
    icon?: JSX.Element,
    children?: ReactNode
};

const GeneratorView = ({ title, icon, children }: GeneratorViewProps) => (
    <Card isFlat isRounded isCompact>
        <CardTitle>
        <div style={{display: "flex", verticalAlign: "bottom"}}>{icon}<span style={{paddingLeft: "4px"}}>{title}</span></div>
        </CardTitle>
        <CardBody>
            {children}
      </CardBody>
    </Card>
  );
  export default GeneratorView;
