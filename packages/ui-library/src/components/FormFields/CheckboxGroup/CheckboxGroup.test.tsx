import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CheckboxGroup } from "./CheckboxGroup";

describe("CheckboxGroup", () => {
  const baseProps = {
    id: "fav-animals",
    legend: "Select your favourite animals",
    name: "animals",
    options: [
      { id: "cat", label: "Cat", value: "cat", checked: false },
      { id: "dog", label: "Dog", value: "dog", checked: true },
      { id: "bird", label: "Bird", value: "bird", checked: false },
    ],
    onChange: vi.fn(),
  };

  it("renders legend and checkboxes", () => {
    render(<CheckboxGroup {...baseProps} />);
    expect(screen.getByText("Select your favourite animals")).toBeInTheDocument();
    expect(screen.getByLabelText("Cat")).toBeInTheDocument();
    expect(screen.getByLabelText("Dog")).toBeInTheDocument();
    expect(screen.getByLabelText("Bird")).toBeInTheDocument();
  });

  it("reflects checked status", () => {
    render(<CheckboxGroup {...baseProps} />);
    expect(screen.getByLabelText("Dog")).toBeChecked();
    expect(screen.getByLabelText("Cat")).not.toBeChecked();
  });

  it("calls onChange with correct value and state", () => {
    render(<CheckboxGroup {...baseProps} />);
    fireEvent.click(screen.getByLabelText("Bird"));
    expect(baseProps.onChange).toHaveBeenCalledWith("bird", true);
  });

  it("renders hint text", () => {
    render(<CheckboxGroup {...baseProps} hint="Pick as many as you like" />);
    expect(screen.getByText("Pick as many as you like")).toBeInTheDocument();
  });

  it("renders error message and applies aria-invalid", () => {
    render(<CheckboxGroup {...baseProps} error="You must choose at least one" />);
    expect(screen.getByText("You must choose at least one")).toBeInTheDocument();
    expect(screen.getByRole("group")).toHaveAttribute("aria-describedby", expect.stringContaining("fav-animals-error"));
  });

  it("renders success message", () => {
    render(<CheckboxGroup {...baseProps} success="Selection looks good" />);
    expect(screen.getByText("Selection looks good")).toBeInTheDocument();
  });

  it("disables options when specified", () => {
    const props = {
      ...baseProps,
      options: [{ id: "cat", label: "Cat", value: "cat", checked: false, disabled: true }],
    };
    render(<CheckboxGroup {...props} />);
    expect(screen.getByLabelText("Cat")).toBeDisabled();
  });

  it("applies filled styling when specified", () => {
    render(<CheckboxGroup {...baseProps} filled />);
    expect(screen.getByRole("group").className).toContain("qld__form-style-filled");
  });

  it("renders required asterisk", () => {
    render(<CheckboxGroup {...baseProps} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
