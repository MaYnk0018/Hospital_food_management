import { Request, Response } from "express";
import { Delivery, IDelivery } from "../models/Delivery";
import mongoose from "mongoose";
import { logger } from "@/utils/Logger";

interface IDeliveryPersonnel {
  id: string;
  userId: string;
  status: "available" | "delivering";
}



export class DeliveryController {
  async getDeliveryAssignments(req: Request, res: Response) {
    const deliveryPersonId = req.user?.userId;
    console.log("idText", req.user?.userId);
  
    if (!deliveryPersonId) {
      logger.error("User ID not found in request");
      console.log("User ID not found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const assignments = await Delivery.find({
      assignedTo: deliveryPersonId,
      status: { $ne: "delivered" },
    })
      .populate({
        path: "dietId",
        populate: {
          path: "patientId",
          select: "name roomNumber bedNumber",
        },
      })
      .sort({ mealTime: 1 });
    console.log("assignments", assignments);
  
    logger.debug("Retrieved assignments", { count: assignments.length });
    return assignments;
  }

  async updateDeliveryStatus(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { status, notes } = req.body;
    const deliveryPersonId = req.user?.userId;

    if (!deliveryPersonId) {
      logger.error("User ID not found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const delivery = await Delivery.findOne({
      _id: id,
      assignedTo: deliveryPersonId,
    });

    if (!delivery) {
      logger.error("Delivery not found", { id, deliveryPersonId });
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.status === "delivered") {
      logger.warn("Attempted to update completed delivery", { id });
      return res.status(400).json({ message: "Delivery already completed" });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        ...(status === "delivered" && { deliveredAt: new Date() }),
      },
      { new: true }
    ).populate({
      path: "dietId",
      populate: {
        path: "patientId",
        select: "name roomNumber bedNumber",
      },
    });

    logger.info("Delivery status updated", {
      id,
      status,
      deliveryPersonId,
    });

    return updatedDelivery;
  }

  // async getDeliveryHistory(req: Request, res: Response) {
  //   const deliveryPersonId = req.user?.userId;

  //   if (!deliveryPersonId) {
  //     logger.error("User ID not found in request");
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  //   const { startDate, endDate } = req.query;

  //   const query: any = {
  //     assignedTo: deliveryPersonId,
  //     status: "delivered",
  //   };

  //   if (startDate && endDate) {
  //     query.deliveredAt = {
  //       $gte: new Date(startDate as string),
  //       $lte: new Date(endDate as string),
  //     };
  //   }

  //   const history = await Delivery.find(query)
  //     .populate({
  //       path: "dietId",
  //       populate: {
  //         path: "patientId",
  //         select: "name roomNumber bedNumber",
  //       },
  //     })
  //     .sort({ deliveredAt: -1 });

  //   logger.info("Retrieved delivery history", {
  //     userId: deliveryPersonId,
  //     count: history.length,
  //     dateRange: startDate && endDate ? { startDate, endDate } : "all",
  //   });

  //   return {
  //     totalDeliveries: history.length,
  //     deliveries: history,
  //   };
  // }

  async getCurrentDelivery(req: Request, res: Response) {
    const deliveryPersonId = req.user?.userId;

    if (!deliveryPersonId) {
      logger.error("User ID not found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentDelivery = await Delivery.findOne({
      assignedTo: deliveryPersonId,
      status: "in-progress",
    }).populate({
      path: "dietId",
      populate: {
        path: "patientId",
        select: "name roomNumber bedNumber floorNumber",
      },
    });

    if (!currentDelivery) {
      logger.warn("No active delivery found", { deliveryPersonId });
      return res.status(404).json({ message: "No active delivery found" });
    }

    logger.info("Retrieved current delivery", {
      deliveryId: currentDelivery._id,
      deliveryPersonId,
    });

    return currentDelivery;
  }
}