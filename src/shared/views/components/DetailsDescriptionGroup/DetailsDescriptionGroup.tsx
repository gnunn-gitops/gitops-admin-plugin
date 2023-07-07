import { DescriptionListDescription, DescriptionListGroup, DescriptionListTermHelpText, DescriptionListTermHelpTextButton, Popover } from '@patternfly/react-core';
import * as React from 'react';

type DetailsDescriptionGroupProps = {
    title: string;
    help: string;
}

export const DetailsDescriptionGroup = (props: React.PropsWithChildren<DetailsDescriptionGroupProps>) => {

    return (
            <DescriptionListGroup>
                <DescriptionListTermHelpText>
                    <Popover headerContent={<div>{props.title}</div>} bodyContent={<div>{props.help}</div>}>
                        <DescriptionListTermHelpTextButton>{props.title}</DescriptionListTermHelpTextButton>
                    </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                    {props.children}
                </DescriptionListDescription>
            </DescriptionListGroup>
    );
}
