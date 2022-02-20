
/**
* @jest-environment jsdom
*/
import React from "react";
import {render,screen} from "@testing-library/react";
import Home from "./index";

describe("Home", () => {
  it("should render the version", () => {

    render(<Home />);
    const version = screen.getByText(/version/i);

    expect(version).toBeInTheDocument();
  });
});
