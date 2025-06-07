import Api from "@/Api";

export function GetNotify(statusFilter: string) {
    return Api.get(`/api/Notify?wasRead=${statusFilter}`);
}

export function GetNotificationDoesNotRead() {
    return Api.get("/api/Notify/GetNotificationDoesNotRead");
}

export function UpdateNotificatioForRead(Id: string) {
    return Api.put(`/api/Notify/update?Id=${Id}`);
}