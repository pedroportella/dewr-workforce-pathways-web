import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadioGroup, RadioButton } from "./RadioGroup";

describe("RadioGroup", () => {
  const baseProps = {
    id: "preferred-device",
    legend: "Select your preferred device",
    name: "device",
    selectedValue: "tablet",
    onChange: vi.fn(),
  };

  it("renders legend and all radio buttons", () => {
    render(
      <RadioGroup {...baseProps}>
        <RadioButton
          id="laptop"
          name="device"
          label="Laptop"
          value="laptop"
          checked={false}
          onChange={baseProps.onChange}
        />
        <RadioButton
          id="tablet"
          name="device"
          label="Tablet"
          value="tablet"
          checked={true}
          onChange={baseProps.onChange}
        />
        <RadioButton
          id="phone"
          name="device"
          label="Phone"
          value="phone"
          checked={false}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );

    expect(screen.getByText("Select your preferred device")).toBeInTheDocument();
    expect(screen.getByLabelText("Laptop")).toBeInTheDocument();
    expect(screen.getByLabelText("Tablet")).toBeChecked();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
  });

  it("triggers onChange with selected value", () => {
    render(
      <RadioGroup {...baseProps}>
        <RadioButton
          id="laptop"
          name="device"
          label="Laptop"
          value="laptop"
          checked={false}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );

    fireEvent.click(screen.getByLabelText("Laptop"));
    expect(baseProps.onChange).toHaveBeenCalledWith("laptop");
  });

  it("renders hint text", () => {
    render(
      <RadioGroup {...baseProps} hint="Choose one device only">
        <RadioButton
          id="laptop"
          name="device"
          label="Laptop"
          value="laptop"
          checked={false}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );
    expect(screen.getByText("Choose one device only")).toBeInTheDocument();
  });

  it("renders error message and applies aria-describedby", () => {
    render(
      <RadioGroup {...baseProps} error="Device is required">
        <RadioButton
          id="tablet"
          name="device"
          label="Tablet"
          value="tablet"
          checked={true}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );
    expect(screen.getByText("Device is required")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("preferred-device-error"),
    );
  });

  it("renders success message", () => {
    render(
      <RadioGroup {...baseProps} success="Looks good">
        <RadioButton
          id="tablet"
          name="device"
          label="Tablet"
          value="tablet"
          checked={true}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );
    expect(screen.getByText("Looks good")).toBeInTheDocument();
  });

  it("disables a radio option if specified", () => {
    render(
      <RadioGroup {...baseProps}>
        <RadioButton
          id="tablet"
          name="device"
          label="Tablet"
          value="tablet"
          checked={true}
          onChange={baseProps.onChange}
          disabled
        />
      </RadioGroup>,
    );
    expect(screen.getByLabelText("Tablet")).toBeDisabled();
  });

  it("renders filled styling", () => {
    render(
      <RadioGroup {...baseProps} filled>
        <RadioButton
          id="tablet"
          name="device"
          label="Tablet"
          value="tablet"
          checked={true}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup").className).toContain("qld__form-style-filled");
  });

  it("renders required asterisk", () => {
    render(
      <RadioGroup {...baseProps} required>
        <RadioButton
          id="tablet"
          name="device"
          label="Tablet"
          value="tablet"
          checked={true}
          onChange={baseProps.onChange}
        />
      </RadioGroup>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
