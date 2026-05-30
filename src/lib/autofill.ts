const knownSiteAliases: Record<string, { hosts: string[]; keywords: string[] }> = {
  facebook: {
    hosts: ["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "mbasic.facebook.com"],
    keywords: ["facebook", "fb"]
  },
  instagram: {
    hosts: ["instagram.com", "www.instagram.com"],
    keywords: ["instagram", "insta"]
  },
  google: {
    hosts: ["google.com", "accounts.google.com", "mail.google.com"],
    keywords: ["google", "gmail"]
  },
  gmail: {
    hosts: ["google.com", "accounts.google.com", "mail.google.com"],
    keywords: ["google", "gmail"]
  },
  x: {
    hosts: ["x.com", "twitter.com", "mobile.twitter.com"],
    keywords: ["x", "twitter"]
  },
  twitter: {
    hosts: ["x.com", "twitter.com", "mobile.twitter.com"],
    keywords: ["x", "twitter"]
  },
  linkedin: {
    hosts: ["linkedin.com", "www.linkedin.com"],
    keywords: ["linkedin"]
  },
  github: {
    hosts: ["github.com"],
    keywords: ["github"]
  },
  microsoft: {
    hosts: ["login.microsoftonline.com", "live.com", "microsoft.com", "account.microsoft.com"],
    keywords: ["microsoft", "outlook", "hotmail", "live"]
  },
  outlook: {
    hosts: ["login.microsoftonline.com", "live.com", "outlook.live.com", "microsoft.com"],
    keywords: ["microsoft", "outlook", "hotmail", "live"]
  },
  yahoo: {
    hosts: ["login.yahoo.com", "yahoo.com"],
    keywords: ["yahoo"]
  },
  tiktok: {
    hosts: ["tiktok.com", "www.tiktok.com"],
    keywords: ["tiktok"]
  }
};

function normalizeHost(value: string) {
  try {
    const url = value.startsWith("http") ? new URL(value) : new URL(`https://${value}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function compact(value: string | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function findKnownAliases(platform: string, host: string) {
  const aliasKey = Object.keys(knownSiteAliases).find((key) => {
    const aliases = knownSiteAliases[key];
    return platform.includes(key) || aliases.hosts.some((aliasHost) => {
      const normalizedAliasHost = normalizeHost(aliasHost);
      return host === normalizedAliasHost || host.endsWith(`.${normalizedAliasHost}`);
    });
  });

  return aliasKey ? knownSiteAliases[aliasKey] : { hosts: [], keywords: [] };
}

export function buildAutofillHints(input: { platformName: string; websiteUrl: string }) {
  const platform = compact(input.platformName);
  const host = normalizeHost(input.websiteUrl);
  const aliases = findKnownAliases(platform, host);
  const hostParts = host.split(".").filter((part) => part && !["www", "com", "net", "org", "io", "app", "co"].includes(part));

  return {
    hosts: unique([host, ...aliases.hosts.map(normalizeHost)]),
    keywords: unique([platform, ...hostParts.map(compact), ...aliases.keywords.map(compact)]),
    loginPaths: ["/login", "/signin", "/sign-in", "/auth", "/accounts/login"]
  };
}
