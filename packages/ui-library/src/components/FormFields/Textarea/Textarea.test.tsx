import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  const baseProps = {
    id: "story",
    label: "Your story",
    value: "",
    onChange: vi.fn(),
  };

  it("renders with label", () => {
    render(<Textarea {...baseProps} />);
    expect(screen.getByLabelText("Your story")).toBeInTheDocument();
  });

  it("calls onChange when text is entered", () => {
    const handleChange = vi.fn();
    render(<Textarea {...baseProps} onChange={handleChange} />);
    const textarea = screen.getByLabelText("Your story");
    fireEvent.change(textarea, { target: { value: "Once upon a time..." } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("shows hint text", () => {
    render(<Textarea {...baseProps} hint="Tell us something interesting" />);
    expect(screen.getByText("Tell us something interesting")).toBeInTheDocument();
  });

  it("displays an error message and applies error styles", () => {
    render(<Textarea {...baseProps} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveClass("qld__text-input--error");
  });

  it("displays a success message and applies success styles", () => {
    render(<Textarea {...baseProps} success="Looks good!" />);
    expect(screen.getByText("Looks good!")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("qld__text-input--valid");
  });

  it("respects disabled state", () => {
    render(<Textarea {...baseProps} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders with filled styling if specified", () => {
    const { container } = render(<Textarea {...baseProps} filled />);
    const wrapper = container.querySelector(".qld__form-style-filled");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders required field indicator", () => {
    render(<Textarea {...baseProps} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
