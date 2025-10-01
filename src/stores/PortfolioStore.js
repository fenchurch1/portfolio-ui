import { makeAutoObservable, runInAction } from "mobx";
import { apiClient } from "../API/apiservises";
import APIEndpoints from "../API/profile/APIEndpoints";

class PortfolioStore {
  
  portfolios = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPortfolios() {
    this.loading = true;
    this.error = null;
    try {
      const response = await apiClient.get(APIEndpoints.fetchPortfolios.replace('{userId}', localStorage.getItem('UserId'),), '');
      const data = [
  ...(response?.portfolio_data?.owned_portfolios || []),
  ...(response?.portfolio_data?.shared_with_me_portfolios || []),
];


      if (!Array.isArray(data)) throw new Error("Invalid portfolio data format");

      runInAction(() => {
        this.portfolios = data.map(item => ({
          PortfolioId: item.portfolio_id,
          portfolioName: item.portfolio_name,
          fileName: item.file_name,
          Comment: item.comment,
          uploadedAt: item.uploaded_at || new Date().toLocaleString(),
          fileId: item.file_id,
          data: item.data || [],
          isSelected: item.isSelected || false,
        }));
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  }

  async addPortfolio({ fileName, Comment, portfolioName, data,SharedWithteam, list_type }) {
    this.loading = true;
    this.error = null;
    const poolValue = data.Exceldata[0]?.pool_number;
    const cusipValue = data.Exceldata[0]?.cusip;

    const PoolId = poolValue ? poolValue.match(/^[A-Za-z]{2} [A-Za-z0-9]{6}$/) : null;
    const CusipId = cusipValue ? cusipValue.match(/^[A-Za-z0-9]{9}$/) : null;
    const Data = data.Exceldata?.map((item) => {
      return {
        cusip: list_type == 'cusip'? item.cusip: list_type == 'pool_number'? item.agy_short + " " + item.pool_number:null,
        value: item.face_amt || item.orig_face || null,
      }
    })
    try {
      const response = await apiClient.post(APIEndpoints.addPortfolio, '', {
        portfolio_name: portfolioName,
        user_id: localStorage.getItem('UserId'),
        comment: Comment,
        share_with_team: SharedWithteam,
        file_id: data?.file_id,
        filename: fileName,
        pool_count: data.Exceldata?.length || 0,
        list_type: list_type,
        prefixed: true,
        data: Data,

      });

      runInAction(() => {
        this.portfolios.push({
          fileName,
          Comment,
          portfolioName,
          data: data.Exceldata || [],
          uploadedAt: new Date().toLocaleString(),
          isSelected: false,
          PortfolioId: response?.portfolio_id || Date.now(), // temporary ID if not returned
          userId: response?.userId || 1, // default userId if not returned
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message || "Something went wrong";
        this.loading = false;
      });
    }
  }

  toggleSelection(id, isSelected) {
    this.portfolios = this.portfolios.map(p =>
      p.PortfolioId === id ? { ...p, isSelected } : p
    );
  }

  async removePortfolio(portfolioId) {
    this.loading = true;
    this.error = null;
    try {
      const response = await apiClient.delete(
        APIEndpoints.deletePortfolio
          .replace('{userId}', localStorage.getItem('UserId'))
          .replace('{portfolioId}', portfolioId)
      );

      if (!response || response.status !== true) throw new Error("Failed to delete portfolio");

      runInAction(() => {
        this.portfolios = this.portfolios.filter(p => p.PortfolioId !== portfolioId);

        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message || "Failed to delete portfolio";
        this.loading = false;
      });
    }
  }
}

export const portfolioStore = new PortfolioStore();
