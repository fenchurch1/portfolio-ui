import profile from "./profile";
const APIEndpoints = {
    login:`${profile.getBaseUrl()}/login/`,
    uploadFile: `${profile.getBaseUrl()}/upload-file/`,
    getPortfolioById: `${profile.getBaseUrl()}/portfolio-holdings-view/?user_id={userId}&portfolio_id={portfolioId}`,
    getGraphbyPoolId:`${profile.getBaseUrl()}/pool-view/?user_id={userId}&pool_id={id}`,
    addPortfolio: `${profile.getBaseUrl()}/portfolio-management/`,
    fetchPortfolios: `${profile.getBaseUrl()}/portfolio-management/?user_id={userId}`,
    fetchTeamMates:`${profile.getBaseUrl()}/UserTeam-members/{userId}/`,
    getHoldingDetails:`${profile.getBaseUrl()}/portfolio-holdings-view/?user_id={userId}&portfolio_id={portfolioId}`,
    deletePortfolio: `${profile.getBaseUrl()}/portfolio-management/?user_id={userId}&portfolio_id={portfolioId}`,
    sharePortfolio:`${profile.getBaseUrl()}/share-portfolio/`,
    getAllNotification:`${profile.getBaseUrl()}//portfolio-holdings-view/?user_id={userId}`,
    updateNotification:`${profile.getBaseUrl()}//portfolio-holdings-view/?user_id={userId}`
};
export default APIEndpoints;