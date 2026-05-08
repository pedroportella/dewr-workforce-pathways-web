import { expect } from "vitest";

const isElement = (received: unknown): received is Element => received instanceof Element;

const matcherResult = (pass: boolean, message: string) => ({
  pass,
  message: () => message,
});

expect.extend({
  toBeInTheDocument(received: unknown) {
    const pass =
      received !== null &&
      received !== undefined &&
      isElement(received) &&
      received.ownerDocument.body.contains(received);

    return matcherResult(pass, "expected element to be in the document");
  },

  toHaveAttribute(received: unknown, name: string, expectedValue?: unknown) {
    if (!isElement(received)) {
      return matcherResult(false, "expected received value to be an element");
    }

    const actualValue = received.getAttribute(name);
    const expectedMatcher = expectedValue as { asymmetricMatch?: (value: string | null) => boolean };
    const pass =
      actualValue !== null &&
      (expectedValue === undefined
        ? true
        : typeof expectedMatcher.asymmetricMatch === "function"
          ? expectedMatcher.asymmetricMatch(actualValue)
          : actualValue === String(expectedValue));

    return matcherResult(pass, `expected element to have attribute ${name}`);
  },

  toHaveClass(received: unknown, ...classNames: string[]) {
    if (!isElement(received)) {
      return matcherResult(false, "expected received value to be an element");
    }

    const pass = classNames.every((className) => received.classList.contains(className));
    return matcherResult(pass, `expected element to have classes ${classNames.join(", ")}`);
  },

  toBeDisabled(received: unknown) {
    if (!isElement(received)) {
      return matcherResult(false, "expected received value to be an element");
    }

    const pass = received.hasAttribute("disabled") || (received as HTMLInputElement).disabled === true;
    return matcherResult(pass, "expected element to be disabled");
  },

  toBeChecked(received: unknown) {
    if (!isElement(received)) {
      return matcherResult(false, "expected received value to be an element");
    }

    const pass = (received as HTMLInputElement).checked === true;
    return matcherResult(pass, "expected element to be checked");
  },

  toHaveStyle(received: unknown, expectedStyle: string) {
    if (!isElement(received)) {
      return matcherResult(false, "expected received value to be an element");
    }

    const normalise = (style: string) => style.replace(/"/g, "'").replace(/\s+/g, " ").trim();
    const pass = normalise(received.getAttribute("style") ?? "").includes(normalise(expectedStyle));

    return matcherResult(pass, `expected element to have style ${expectedStyle}`);
  },
});
