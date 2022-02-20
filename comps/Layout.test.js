/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

describe("LayoutComponent", () => {
  it("Should find MFRC", () => {
    render(<Layout />);
    const heading = screen.getByText(/Mad River Floral Collective/i);

    expect(heading).toBeInTheDocument();
  });
});
