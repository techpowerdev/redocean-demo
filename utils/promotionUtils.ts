import { Promotion } from "@/types/baseTypes";

/**
 * เลือกโปรโมชั่นที่ใช้งานอยู่ หรือใกล้เริ่มที่สุด
 */
export function getNearestPromotion(promotions: Promotion[]): Promotion | null {
  const now = new Date();

  const activePromotions = promotions.filter((promo) => {
    const start = new Date(promo.startAt);
    const end = new Date(promo.endAt);
    return start <= now && end >= now;
  });

  if (activePromotions.length > 0) {
    return activePromotions.reduce((nearest, current) => {
      const currentDiff = Math.abs(
        new Date(current.startAt).getTime() - now.getTime()
      );
      const nearestDiff = Math.abs(
        new Date(nearest.startAt).getTime() - now.getTime()
      );
      return currentDiff < nearestDiff ? current : nearest;
    });
  }

  const futurePromotions = promotions.filter(
    (promo) => new Date(promo.startAt) > now
  );

  if (futurePromotions.length > 0) {
    return futurePromotions.reduce((soonest, current) =>
      new Date(current.startAt) < new Date(soonest.startAt) ? current : soonest
    );
  }

  return null;
}

export function getSortedUniqueStartTimes(
  promotions: Promotion[]
): { startAt: string; endAt: string }[] {
  const seen = new Set<string>();

  const uniqueTimes = promotions
    .filter((p) => {
      const key = p.startAt; // ใช้ iso string เปรียบเทียบ
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((p) => ({
      startAt: p.startAt, // แปลงเป็น string ก่อนส่งให้ client
      endAt: p.endAt,
    }))
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  return uniqueTimes;
}

// Filter promotions by start time
export const filterPromotionsByStartTime = (
  time: string,
  promotions: Promotion[]
): Promotion[] => {
  return promotions.filter((p) => p.startAt === time);
};
