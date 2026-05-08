import { setupWorker } from "msw/browser";
import { workforceHandlers } from "@dewr/services-workforce/mocks";

export const worker = setupWorker(...workforceHandlers);
