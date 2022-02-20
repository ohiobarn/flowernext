/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("NavbarComponent", () => {

  it("Should have Catalog link", () => {

    render(<Navbar />);
    // screen.debug();

    let navLink
    
    navLink = screen.getByRole('link', { name: /Catalog/i });
    expect(navLink).toBeVisible();

    navLink = screen.getByRole('link', { name: /Availability/i });
    expect(navLink).toBeVisible();

    navLink = screen.getByRole('link', { name: /Orders/i });
    expect(navLink).toBeVisible();

    navLink = screen.getByRole('link', { name: /Help/i });
    expect(navLink).toBeVisible();

  });

});

