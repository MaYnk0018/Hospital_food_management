import React from "react";
import { IDelivery } from "../types/random";
interface DeliveryStatusProps {
    deliveries: IDelivery[];
    onUpdateStatus: (deliveryId: string, status: "assigned" | "in-progress" | "delivered") => void;
}
export declare const DeliveryStatus: React.FC<DeliveryStatusProps>;
export {};
