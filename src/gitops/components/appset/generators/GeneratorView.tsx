import * as React from 'react';
import { ReactNode } from 'react';
import { Card, CardBody, CardTitle, Divider, Icon } from '@patternfly/react-core';


type GeneratorViewProps = {
    title: string,
    icon?: JSX.Element,
    children?: ReactNode
};

const GeneratorView = ({ title, icon, children }: GeneratorViewProps) => (
    <Card isFlat isRounded isCompact>
        <CardTitle>
            <div style={{display: "flex", verticalAlign: "bottom"}}><Icon size="lg">{icon}</Icon><span style={{paddingLeft: "6px"}}>{title}</span></div>
            <Divider style={{paddingTop: "6px", paddingBottom: "4px"}}/>
        </CardTitle>
        <CardBody>
            {children}
      </CardBody>
    </Card>
  );
  export default GeneratorView;
