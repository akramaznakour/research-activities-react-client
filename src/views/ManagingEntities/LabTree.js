import React, {
  useEffect,
  Fragment,
  useContext,
  useState,
  useCallback,
} from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import OrgChart from "./mychart";

const LabTree = () => {
  const { user, ApiServices, UserHelper } = useContext(AppContext);
  const { laboratoryService } = ApiServices;

  const [isLoading, setIsLoading] = useState(true);

  const [nodes, setNodes] = useState([]);

  const updateNodes = useCallback(async () => {
    let orgChartNodes;
    orgChartNodes = await laboratoryService.getNodesForOrgChart();
    console.log(orgChartNodes.data);
    setNodes(orgChartNodes.data);
    setIsLoading(false);
  }, [laboratoryService]);

  useEffect(() => {
    updateNodes();
  }, [updateNodes]);

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader
          title={`Organigramme de laboratoire ${UserHelper.userHeadedLaboratories(
            user
          )}`}
        />
      </div>
      <div style={{ height: "100%" }}>
        {!isLoading ? (
          <OrgChart
            fileName={UserHelper.userHeadedLaboratories(user)}
            name={["Laboratoire", UserHelper.userHeadedLaboratories(user)].join(
              " "
            )}
            nodes={nodes}
          />
        ) : (
          "L'organigramme se charge ..."
        )}
      </div>
    </Fragment>
  );
};

export default LabTree;
