/*
   Matchers that say what they mean.

   `expect(el.getAttribute("title")).toBe("...")` fails with two strings and no
   indication of which element disappointed it. `toHaveAttribute` names the
   element, the attribute and both values. Across two hundred tests that is the
   difference between a failure you can read and one you have to reproduce.
*/
import "@testing-library/jest-dom/vitest";
