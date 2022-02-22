import {render,screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import Home from "../pages/index";

describe("Home", () => {

  it("Should render login link", () => {
    render(<Home />);
    const login = screen.getByRole("link",{name: /login/i});
    expect(login).toBeInTheDocument();
  });

  it("Should render the version", () => {
    render(<Home />);
    const version = screen.getByText(/version/i);
    expect(version).toBeInTheDocument();
  });
});

