import {render,screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import Layout from "../comps/Layout";

describe("LayoutComponent", () => {
  it("Should find MFRC", () => {
    render(<Layout />);
    const heading = screen.getByText(/Mad River Floral Collective/i);
    expect(heading).toBeInTheDocument();
  });
});
