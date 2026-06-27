import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import App from "./App";

describe("App", () => {
  it("renders without triggering an update loop", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    expect(() => {
      act(() => {
        root.render(<App />);
      });
    }).not.toThrow();

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
