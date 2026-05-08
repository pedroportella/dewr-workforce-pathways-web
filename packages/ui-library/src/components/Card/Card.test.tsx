// packages/ui-library/src/components/Card/Card.test.tsx
"use client";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";

const fileIcon = { iconName: "file" };
const navigate = vi.fn();

describe("Card", () => {
  it("renders no-action card with title and description", () => {
    render(<Card title="Test Card" description="Test description" />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders single-action card with clickable link", () => {
    render(<Card title="Clickable Card" onNavigate={navigate} route="/test" />);
    const link = screen.getByRole("link", { name: "Clickable Card" });
    expect(link).toHaveAttribute("href", "/test");
  });

  it("renders multi-action card with multiple footer links", () => {
    render(
      <Card
        variant="multi-action"
        title="Multi Action Card"
        footerLinks={[
          { label: "Link 1", href: "/link1", icon: fileIcon },
          { label: "Link 2", href: "/link2" },
        ]}
      />,
    );

    const footerLinks = screen.getAllByRole("link");
    expect(footerLinks).toHaveLength(2);
    expect(footerLinks[0]).toHaveAttribute("href", "/link1");
    expect(footerLinks[1]).toHaveAttribute("href", "/link2");
  });

  it("renders single-action-with-footer card with footer text", () => {
    render(<Card variant="single-action-with-footer" title="Footer Card" footerText="Footer content here" />);

    expect(screen.getByText("Footer content here")).toBeInTheDocument();
  });

  it("renders image card with background image", () => {
    render(<Card variant="single-click-image" title="Image Card" imageUrl="/test-image.png" />);

    const imageDiv = document.querySelector(".qld__responsive-media-img--bg") as HTMLElement;
    expect(imageDiv).toHaveStyle(`background-image: url('/test-image.png')`);
  });

  it("renders icon in icon card", () => {
    render(<Card variant="single-action-icon" title="Icon Card" icon={fileIcon} />);

    expect(document.querySelector(".qld__card__icon")).toBeInTheDocument();
  });

  it("renders arrow in single-action-arrow card", () => {
    render(<Card variant="single-action-arrow" title="Arrow Card" />);

    expect(document.querySelector(".qld__card__arrow")).toBeInTheDocument();
  });
});
