import dns from "node:dns/promises";

import disposableDomains from "disposable-email-domains";

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split("@")[1];
  return disposableDomains.includes(domain);
};

export const hasMailServer = async (email: string): Promise<boolean> => {
  const domain = email.split("@")[1];

  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (_error) {
    return false;
  }
};
