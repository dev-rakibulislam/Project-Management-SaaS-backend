import type { PlatformRole } from "../../generated/enums";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  PlatformRole: PlatformRole;
}
