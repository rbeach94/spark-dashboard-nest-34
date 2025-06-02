
import { NFCCode } from "@/pages/AdminDashboard";
import NFCCodeManagement from "./NFCCodeManagement";
import ReviewCodeManagement from "./ReviewCodeManagement";
import { UserManagementCard } from "./UserManagementCard";
import { ProfileManagementCard } from "./ProfileManagementCard";
import RecentActivatedCodesCard from "./RecentActivatedCodesCard";

interface AdminDashboardContentProps {
  nfcCodes: NFCCode[];
  reviewCodes: NFCCode[];
  users: { id: string; email: string | null; role: string | null; }[];
  isGeneratingNFC: boolean;
  isGeneratingReview: boolean;
  onGenerateNFCCodes: (count: number) => void;
  onGenerateReviewCodes: (count: number) => void;
  onDownloadNFCCSV: () => void;
  onDownloadReviewCSV: () => void;
  isLoading: {
    users: boolean;
    codes: boolean;
    reviewCodes: boolean;
  };
}

export const AdminDashboardContent = ({
  nfcCodes,
  reviewCodes,
  users,
  isGeneratingNFC,
  isGeneratingReview,
  onGenerateNFCCodes,
  onGenerateReviewCodes,
  onDownloadNFCCSV,
  onDownloadReviewCSV,
  isLoading,
}: AdminDashboardContentProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <NFCCodeManagement
        nfcCodes={nfcCodes || []}
        isGenerating={isGeneratingNFC}
        onGenerateCodes={onGenerateNFCCodes}
        onDownloadCSV={onDownloadNFCCSV}
      />

      <ReviewCodeManagement
        reviewCodes={reviewCodes || []}
        isGenerating={isGeneratingReview}
        onGenerateCodes={onGenerateReviewCodes}
        onDownloadCSV={onDownloadReviewCSV}
      />

      <ProfileManagementCard />

      <UserManagementCard 
        users={users} 
        isLoading={isLoading.users} 
      />

      {nfcCodes && (
        <RecentActivatedCodesCard codes={nfcCodes} />
      )}
    </div>
  );
};
