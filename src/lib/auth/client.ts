"use client";

import { createAuthClient } from "better-auth/react";
import { BASE_PATH } from "@/lib/base-path";

// Same-origin requests to <base path>/api/auth, whatever domain the site is deployed on.
export const authClient = createAuthClient({ basePath: `${BASE_PATH}/api/auth` });
