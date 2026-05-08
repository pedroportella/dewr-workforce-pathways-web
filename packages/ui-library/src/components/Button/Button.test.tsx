// packages/ui-library/src/components/Button/Button.test.tsx
"use client";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  const navigate = vi.fn();

  it("renders primary button and calls onClick", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(btn).toHaveClass("qld__btn", "qld__btn--primary");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("qld__btn--secondary");
  });

  it("renders tertiary variant as link", () => {
    render(
      <Button onNavigate={navigate} route="/about" variant="tertiary">
        About
      </Button>,
    );
    const buttonLink = screen.getByRole("button", { name: "About" });
    expect(buttonLink).toHaveClass("qld__btn--tertiary");
    expect(buttonLink).toHaveAttribute("href", "/about");
  });

  it("applies type correctly", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
