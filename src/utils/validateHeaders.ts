export const validateHeaders = (
  clientName: string,
  apiKey: string
): boolean => {
  const validClient = process.env.CLIENT_NAME || "";
  const validApiKey = process.env.API_KEY || "";

  const validClients: Record<string, string> = {
    [validClient]: validApiKey,
  };

  return validClients[clientName] === apiKey;
};
