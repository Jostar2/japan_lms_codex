import tokenContractJson from "../../contracts/design-tokens.contract.json";

export type TokenCategory = "color" | "radius" | "shadow" | "motion" | "typography";

export interface DesignToken {
  cssVariable: `--${string}`;
  value: string;
  role: string;
}

export interface DesignTokenContract {
  version: string;
  source: string;
  principle: string;
  rootTokens: Record<string, unknown>;
  semanticRules: Record<string, string[]>;
  componentOverrides: Record<string, { value: string; reason: string }>;
}

export const designTokenContract = tokenContractJson as DesignTokenContract;

export function flattenDesignTokens(): DesignToken[] {
  const tokens: DesignToken[] = [];
  collectTokens(designTokenContract.rootTokens, tokens);
  return tokens;
}

export function getCssVariableValue(cssVariable: `--${string}`): string {
  const token = flattenDesignTokens().find((item) => item.cssVariable === cssVariable);

  if (!token) {
    throw new Error(`Unknown design token variable: ${cssVariable}`);
  }

  return token.value;
}

function collectTokens(value: unknown, tokens: DesignToken[]): void {
  if (!value || typeof value !== "object") return;

  if (isDesignToken(value)) {
    tokens.push(value);
    return;
  }

  for (const nested of Object.values(value)) {
    collectTokens(nested, tokens);
  }
}

function isDesignToken(value: object): value is DesignToken {
  const maybe = value as Partial<DesignToken>;
  return (
    typeof maybe.cssVariable === "string" &&
    maybe.cssVariable.startsWith("--") &&
    typeof maybe.value === "string" &&
    typeof maybe.role === "string"
  );
}
