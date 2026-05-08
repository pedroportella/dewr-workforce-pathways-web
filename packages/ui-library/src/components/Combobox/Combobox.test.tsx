import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Combobox } from "./Combobox";

describe("Combobox", () => {
  const items = [
    { id: "north", label: "North Coast" },
    { id: "south", label: "South East" },
  ];

  it("renders suggestions and selects an item", () => {
    const onSelect = vi.fn();

    render(
      <Combobox
        ariaLabel="Search regions"
        defaultOpen
        getKey={(item) => item.id}
        iconSpriteHref="/icons.svg"
        items={items}
        onSelect={onSelect}
        renderItem={({ item }) => item.label}
        value="coast"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseDown(screen.getByRole("option", { name: "North Coast" }));

    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });
});
