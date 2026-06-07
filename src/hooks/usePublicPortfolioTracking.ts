import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

import {
  recordPortfolioView,
  recordProjectClick,
  recordProjectLinkClick,
  recordSocialClick,
  sendPortfolioTrackingPulse,
  startPortfolioTracking,
} from "@/services/portfolioAnalyticsService";
import { getNetworkName } from "@/utils/PublicPortfolioUtils";

type TrackingPortfolio = {
  config?: {
    slug?: string;
    template?: string | number;
  };
  template?: string | number;
};

type PublicPortfolioTrackingParams = {
  portfolio: TrackingPortfolio | null;
  slug?: string;
  loading: boolean;
  visitId: string | null;
};

export function usePublicPortfolioTracking({ portfolio, slug, loading, visitId }: PublicPortfolioTrackingParams) {
  const recordedViewRef = useRef<string | null>(null);
  const trackingStartRef = useRef<number>(0);
  const visitIdRef = useRef<string | null>(null);

  usePulseTracking(visitId, visitIdRef, trackingStartRef);
  usePortfolioViewTracking(portfolio, slug, loading, recordedViewRef);

  async function getTrackingVisitId() {
    if (visitIdRef.current) return visitIdRef.current;

    const portfolioSlug = String(portfolio?.config?.slug ?? slug ?? "");
    if (!portfolioSlug) return "";

    const trackedVisitId = await startPortfolioTracking({
      slug: portfolioSlug,
      template: portfolio?.config?.template ?? portfolio?.template ?? "0",
    });
    visitIdRef.current = trackedVisitId || null;
    return trackedVisitId;
  }

  async function trackProjectClick(projectId?: string | number) {
    if (!projectId || !visitId) return;
    await recordProjectClick({ visitId, projectId });
  }

  async function trackSocialClick(network: unknown) {
    const networkName = getNetworkName(network);
    const currentVisitId = networkName ? await getTrackingVisitId() : "";
    if (!currentVisitId || !networkName) return;
    await recordSocialClick({ visitId: currentVisitId, networkName });
  }

  function trackProjectLinkClick(projectId: string | number | undefined, linkType: "repository" | "demo", url: string) {
    if (!projectId || !visitId || !url) return;
    void recordProjectLinkClick({ visitId, projectId, linkType });
  }

  return { trackProjectClick, trackSocialClick, trackProjectLinkClick };
}

function usePulseTracking(
  visitId: string | null,
  visitIdRef: MutableRefObject<string | null>,
  trackingStartRef: MutableRefObject<number>,
) {
  useEffect(() => {
    if (!visitId) return undefined;

    visitIdRef.current = visitId;
    trackingStartRef.current = Date.now();
    const pulseInterval = setInterval(() => {
      const secondsElapsed = Math.max(1, Math.round((Date.now() - trackingStartRef.current) / 1000));
      void sendPortfolioTrackingPulse(visitId, secondsElapsed);
    }, 30000);

    return () => clearInterval(pulseInterval);
  }, [visitId, visitIdRef, trackingStartRef]);
}

function usePortfolioViewTracking(
  portfolio: TrackingPortfolio | null,
  slug: string | undefined,
  loading: boolean,
  recordedViewRef: MutableRefObject<string | null>,
) {
  useEffect(() => {
    const publicSlug = portfolio?.config?.slug ?? slug;
    if (loading || !publicSlug || recordedViewRef.current === String(publicSlug)) return;

    recordedViewRef.current = String(publicSlug);
    void recordPortfolioView(String(publicSlug));
  }, [loading, portfolio, recordedViewRef, slug]);
}
