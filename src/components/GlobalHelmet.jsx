import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { AllRoutes } from "../constants/globalConstants";

export const usePageTitle = () => {

  const { t } = useTranslation();
  const { pathname } = useLocation();

  const activeRoute = AllRoutes.find(route => pathname.includes(route.to));
  return activeRoute ? t(activeRoute.label) : '';
};

const GlobalHelmet = () => {

  const title = usePageTitle();

  return (
    <Helmet>
      <title>{title}{title ? ' — ' : ''}Journal of Digital History</title>
    </Helmet>
  )
}

export default GlobalHelmet;