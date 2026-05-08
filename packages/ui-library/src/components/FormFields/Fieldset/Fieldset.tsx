// packages/ui-library/src/components/FormFields/Fieldset/Fieldset.tsx

"use client";

import React from "react";
import classNames from "../../../utils/classNames";
import "./Fieldset.css";

type FieldsetProps = {
  legend: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3" | "h4"; // Customizable heading level
  dataTestId?: string;
};

export const Fieldset: React.FC<FieldsetProps> = ({
  legend,
  description,
  children,
  className,
  headingLevel: Heading = "h3",
  dataTestId,
}) => {
  return (
    <fieldset
      className={classNames("qld__fieldset", "dcir__fieldset", className)}
      data-testid={dataTestId}
    >
      <legend className="qld__fieldset__legend">
        <Heading className="qld__display-md">{legend}</Heading>
        <p className="dcir__fieldset__description">{description}</p>
      </legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;
