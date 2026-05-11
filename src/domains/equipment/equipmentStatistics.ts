export type EquipmentStatisticsCarrier = {
  statistics: {
    counts: Record<string, Partial<Record<string, number>>>;
  };
};

export function incrementStatisticsCount<
  TWorking extends EquipmentStatisticsCarrier,
  TFeature extends keyof TWorking["statistics"]["counts"] & string,
>(
  working: TWorking,
  feature: TFeature,
  id: string,
  delta = 1,
) {
  const currentCount = working.statistics.counts[feature][id] ?? 0;

  return {
    ...working,
    statistics: {
      ...working.statistics,
      counts: {
        ...working.statistics.counts,
        [feature]: {
          ...working.statistics.counts[feature],
          [id]: currentCount + delta,
        },
      },
    },
  } as TWorking;
}
