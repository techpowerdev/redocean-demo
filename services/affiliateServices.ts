import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  approveAffiliateParams,
  approveAffiliateResponse,
  CreateAffiliateParams,
  CreateAffiliateResponse,
  GenerateAffiliateLinkResponse,
  GetAdminAffiliateDashboardResponse,
  GetAffiliateByIdResponse,
  GetAffiliateCommissionHistoryResponse,
  GetAffiliateDashboardResponse,
  GetAffiliateLinksResponse,
  GetAffiliateWithdrawHistoryResponse,
  GetAffiliateWithdrawByIdResponse,
  GetAffiliateWithdrawResponse,
  GetAllAffiliatesResponse,
  GetAllAffiliateWithdrawsResponse,
  GetUserAffiliateResponse,
  SearchAffiliatesResponse,
  SearchAffiliateWithdrawsResponse,
  UpdateAffiliateParams,
  UpdateAffiliateResponse,
  GetAffiliateWithdrawPayoutsResponse,
  CreateAffiliateWithdrawPayoutResponse,
  CancelAffiliateWithdrawPayoutResponse,
  UpdateAffiliateCommissionPolicyResponse,
  GetAffiliateCommissionPolicyResponse,
  UpdateAffiliateCommissionPolicyParams,
  CreateAffiliateCommissionPolicyParams,
  CreateAffiliateCommissionPolicyResponse,
} from "@/types/affiliateTypes";

export const createAffiliate = async (
  data: CreateAffiliateParams
): Promise<CreateAffiliateResponse> => {
  try {
    const response = await authAxios.post(`/affiliate/signup`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สมัคร affiliate ไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllAffiliates = async (): Promise<GetAllAffiliatesResponse> => {
  try {
    const response = await authAxios.get(`/affiliate`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAffiliateById = async (
  id: string
): Promise<GetAffiliateByIdResponse> => {
  try {
    const response = await authAxios.get(`/affiliate/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getUserAffiliate = async (): Promise<GetUserAffiliateResponse> => {
  try {
    const response = await authAxios.get(`/users/affiliate`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const searchAffiliates = async (
  keyword: string
): Promise<SearchAffiliatesResponse> => {
  try {
    const response = await authAxios.get(`/affiliate/search/q`, {
      params: {
        keyword,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateAffiliate = async (
  id: string,
  data: UpdateAffiliateParams
): Promise<UpdateAffiliateResponse> => {
  try {
    const response = await authAxios.patch(`/affiliate/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

// affiliate link
export const generateAffiliateLink = async (
  productItemId: string
): Promise<GenerateAffiliateLinkResponse> => {
  try {
    const response = await authAxios.post(`/affiliate-link/generate`, {
      productItemId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "สร้างลิงก์ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAffiliateLinks =
  async (): Promise<GetAffiliateLinksResponse> => {
    try {
      const response = await authAxios.get(`/affiliate-link`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

// affiliate dashboard
export const getAffiliateDashboard = async (data?: {
  startDate: string;
  endDate: string;
}): Promise<GetAffiliateDashboardResponse> => {
  try {
    const response = await authAxios.get(
      `/affiliate/overview/affiliate-dashboard`,
      {
        params: {
          startDate: data?.startDate,
          endDate: data?.endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAdminAffiliateDashboard = async (data?: {
  startDate: string;
  endDate: string;
}): Promise<GetAdminAffiliateDashboardResponse> => {
  try {
    const response = await authAxios.get(
      `/affiliate/overview/admin-dashboard`,
      {
        params: {
          startDate: data?.startDate,
          endDate: data?.endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const approveAffiliate = async (
  id: string,
  data: approveAffiliateParams
): Promise<approveAffiliateResponse> => {
  try {
    const response = await authAxios.patch(`/affiliate/${id}/approve`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "อัปเดตข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAffiliateCommissionPolicy =
  async (): Promise<GetAffiliateCommissionPolicyResponse> => {
    try {
      const response = await authAxios.get(
        `/affiliate-commission/commission-policy`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const createAffiliateCommissionPolicy = async (
  data: CreateAffiliateCommissionPolicyParams
): Promise<CreateAffiliateCommissionPolicyResponse> => {
  try {
    const response = await authAxios.post(
      `/affiliate-commission/commission-policy`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateAffiliateCommissionPolicy = async (
  id: string,
  data: UpdateAffiliateCommissionPolicyParams
): Promise<UpdateAffiliateCommissionPolicyResponse> => {
  try {
    const response = await authAxios.patch(
      `/affiliate-commission/commission-policy/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAffiliateWithdraw =
  async (): Promise<GetAffiliateWithdrawResponse> => {
    try {
      const response = await authAxios.get(`/affiliate-withdraw/request`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const getAllAffiliateWithdraws =
  async (): Promise<GetAllAffiliateWithdrawsResponse> => {
    try {
      const response = await authAxios.get(`/affiliate-withdraw/all-requests`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const getAffiliateWithdrawById = async (
  id: string
): Promise<GetAffiliateWithdrawByIdResponse> => {
  try {
    const response = await authAxios.get(`/affiliate-withdraw/${id}/detail`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const createAffiliateWithdrawPayout = async (
  id: string
): Promise<CreateAffiliateWithdrawPayoutResponse> => {
  try {
    const response = await authAxios.post(
      `/affiliate-withdraw/${id}/create-payout`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สร้างรายการโอนเงินไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAffiliateWithdrawPayouts = async (
  id: string
): Promise<GetAffiliateWithdrawPayoutsResponse> => {
  try {
    const response = await authAxios.get(
      `/affiliate-withdraw/${id}/list-payouts`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const cancelAffiliateWithdrawPayout = async (
  id: string
): Promise<CancelAffiliateWithdrawPayoutResponse> => {
  try {
    const response = await authAxios.post(
      `/affiliate-withdraw/${id}/cancel-payout`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ยกเลิกการโอนเงินไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const searchAffiliateWithdraws = async (query?: {
  keyword?: string;
  startDate?: string;
  endDate?: string;
}): Promise<SearchAffiliateWithdrawsResponse> => {
  try {
    const response = await authAxios.get(`/affiliate-withdraw/search`, {
      params: {
        keyword: query?.keyword && query.keyword,
        startDate: query?.startDate && query.startDate,
        endDate: query?.endDate && query.endDate,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAffiliateWithdrawHistory =
  async (): Promise<GetAffiliateWithdrawHistoryResponse> => {
    try {
      const response = await authAxios.get(`/affiliate-withdraw/history`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const getAffiliateCommissionHistory =
  async (): Promise<GetAffiliateCommissionHistoryResponse> => {
    try {
      const response = await authAxios.get(`/affiliate-commission/history`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };
