import Api from "@/Api";

export function GetNotify() {
    return Api.get("/api/Notify");
}

export function GetNotificationDoesNotRead() {
    return Api.get("/api/Notify/GetNotificationDoesNotRead");
}

export function UpdateNotificatioForRead(Id: string) {
    return Api.put(`/api/Notify/update?Id=${Id}`);
}