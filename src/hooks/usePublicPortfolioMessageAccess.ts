import { getAuthSession, isAuthenticated } from "@/services/auth";
import { getPortfolioRecipientId } from "@/utils/publicPortfolioUtils";

export function usePublicPortfolioMessageAccess(portfolio: unknown) {
  const isGuestMessage = !isAuthenticated();

  function getMessageAccessError() {
    const session = getAuthSession();
    const portfolioOwnerId = getPortfolioRecipientId(portfolio);

    if (!portfolioOwnerId) return "No se pudo identificar al destinatario del mensaje.";
    if (session?.user?.id != null && String(session.user.id) === String(portfolioOwnerId)) {
      return "No puedes enviarte un mensaje a ti mismo.";
    }

    return "";
  }

  return { isGuestMessage, getMessageAccessError };
}
