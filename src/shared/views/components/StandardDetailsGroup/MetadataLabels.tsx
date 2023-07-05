import * as React from 'react';
import { Label, LabelGroup } from '@patternfly/react-core';

type MetadataLabelsProps = {
  labels?: { [key: string]: string };
};

const MetadataLabels: React.FC<MetadataLabelsProps> = ({ labels }) => {
  return (
    (labels && Object.keys(labels).length > 0) ? 
      ( 
        <LabelGroup numLabels={10} className="metadata-labels-group">
          {Object.keys(labels || {})?.map((key) => {
            return <Label key={key}>{labels[key] ? `${key}=${labels[key]}` : key}</Label>;
          })}
        </LabelGroup>
      ) :
      (
        <span className="metadata-labels-no-labels">No labels</span>
      )
  );

};

export default MetadataLabels;
