import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SelectInput } from "./SelectInput";

describe("SelectInput", () => {
  const baseProps = {
    id: "pet-select",
    label: "Choose your pet",
    value: "dog",
    onChange: vi.fn(),
    options: [
      { value: "", label: "--Please choose an option--" },
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "parrot", label: "Parrot" },
    ],
  };

  it("renders label and select with options", () => {
    render(<SelectInput {...baseProps} />);
    expect(screen.getByLabelText("Choose your pet")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dog" })).toBeInTheDocument();
  });

  it("calls onChange when a new option is selected", () => {
    const handleChange = vi.fn();
    render(<SelectInput {...baseProps} onChange={handleChange} />);
    const select = screen.getByLabelText("Choose your pet");
    fireEvent.change(select, { target: { value: "cat" } });
    expect(handleChange).toHaveBeenCalledWith("cat");
  });

  it("shows error message and applies error styling", () => {
    render(<SelectInput {...baseProps} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveClass("qld__text-input--error");
  });

  it("supports multiple selection", () => {
    const handleChange = vi.fn();
    const multiProps = {
      ...baseProps,
      multiple: true,
      value: ["dog", "cat"],
      onChange: handleChange,
    };
    render(<SelectInput {...multiProps} />);
    const select = screen.getByLabelText("Choose your pet") as HTMLSelectElement;

    const options = select.options;
    for (let i = 0; i < options.length; i++) {
      options[i].selected = ["cat", "parrot"].includes(options[i].value);
    }

    fireEvent.change(select);
    expect(handleChange).toHaveBeenCalled();
  });
});
