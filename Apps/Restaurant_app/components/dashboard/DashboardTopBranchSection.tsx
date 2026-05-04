import { TopPerformingBranchCard } from "@/components/TopPerformingBranchCard";
import { View } from "react-native";
import { InlineSkeleton } from "./InlineSkeleton";

export const DashboardTopBranchSection = ({
  loading,
  analysis,
  cardWidth,
}: any) => {
  return (
    <View style={{ marginTop: 20 }}>
      {loading ? (
        <View style={{ paddingHorizontal: 16 }}>
          <InlineSkeleton width={cardWidth} height={140} />
        </View>
      ) : (
        <TopPerformingBranchCard
          branchName={analysis?.topseller_branch?.branch_name}
          revenue={analysis?.topseller_branch?.amount}
          orders={analysis?.topseller_branch?.orders_count}
        />
      )}
    </View>
  );
};
