import Api from "@/Api";


export function GetNotify(){
    return Api.get("/api/Notify");
}