import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  const baseProps = {
    id: "test-input",
    label: "Name",
    value: "",
    onChange: vi.fn(),
  };

  it("renders with label", () => {
    render(<TextInput {...baseProps} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();

    render(<TextInput {...baseProps} onChange={handleChange} />);
    const input = screen.getByLabelText("Name");

    fireEvent.change(input, { target: { value: "Pedro" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("shows hint text", () => {
    render(<TextInput {...baseProps} hint="This is a hint" />);
    expect(screen.getByText("This is a hint")).toBeInTheDocument();
  });

  it("shows error message and applies error styles", () => {
    render(<TextInput {...baseProps} error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows success message and applies success styles", () => {
    render(<TextInput {...baseProps} success="All good!" />);
    expect(screen.getByText("All good!")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("qld__text-input--valid");
  });

  it("is disabled when passed disabled=true", () => {
    render(<TextInput {...baseProps} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders required field with asterisk", () => {
    render(<TextInput {...baseProps} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
