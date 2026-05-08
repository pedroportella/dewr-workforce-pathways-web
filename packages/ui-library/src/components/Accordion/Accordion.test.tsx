import { render, screen } from "@testing-library/react";
import Accordion from "./Accordion";

describe("Accordion", () => {
  it("renders children", () => {
    render(<Accordion>Click me</Accordion>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
