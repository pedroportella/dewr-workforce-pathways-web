// packages/ui-library/src/components/Icon/Icon.tsx
import { config, type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

config.autoAddCss = false;

export type IconProps = FontAwesomeIconProps;
export type { IconDefinition };

export const Icon = (props: IconProps) => {
  return <FontAwesomeIcon {...props} />;
};
