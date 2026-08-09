// components/banners/ToggleBannerActiveButton.tsx

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import type { BannerType } from "../../../redux/types/banner";
import {
  resetToggleBannerActive,
  toggleBannerActiveFn,
} from "@/redux/banner/toggleBannerActiveSlice";
import { getAllBannersFn } from "@/redux/banner/getBannersSlice";

interface ToggleBannerActiveButtonProps {
  bannerId: number;
  isActive: boolean;
  bannerType: BannerType;
}

const ToggleBannerActiveButton = ({
  bannerId,
  isActive,
  bannerType,
}: ToggleBannerActiveButtonProps) => {
  const toggleBannerActive = useSelector(
    (state: RootState) => state.toggleBannerActive,
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleToggle = () => {
    dispatch(toggleBannerActiveFn({ type: bannerType, id: bannerId }));
  };

  useEffect(() => {
    if (toggleBannerActive.isSuccess) {
      toast.success(
        `Banner ${isActive ? "deactivated" : "activated"} successfully`,
      );
      dispatch(getAllBannersFn({ type: bannerType }));
      dispatch(resetToggleBannerActive());
    }
  }, [
    toggleBannerActive.isSuccess,
    toggleBannerActive.isError,
    dispatch,
    bannerType,
    isActive,
  ]);

  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      onClick={handleToggle}
      disabled={toggleBannerActive.isLoading}
    >
      <Power className="h-4 w-4 mr-2" />
      {isActive ? "Active" : "Inactive"}
    </Button>
  );
};

export default ToggleBannerActiveButton;
