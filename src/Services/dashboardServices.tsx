import Api from "../Api/index";

export function GetDashboard(){
    return Api.get(`/api/DashBoard`);
}