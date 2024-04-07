import * as React from 'react';
import { ReactNode } from 'react';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';


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
