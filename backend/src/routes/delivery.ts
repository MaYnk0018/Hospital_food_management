import { Router, Request, Response } from "express";
import { DeliveryController } from "../controllers/deliveryController";
import { authMiddleware } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/Logger";

const router = Router();
const controller = new DeliveryController();

router.use(authMiddleware);
router.use(roleMiddleware(["delivery"]));

router.get(
  "/assignments",
  asyncHandler(async (req: Request, res: Response) => {
    const assignments = await controller.getDeliveryAssignments(req, res);
    console.log("assignments",assignments);
    logger.info("Fetched delivery assignments", { userId: req.user?.userId });
    res.json(assignments);
  })
);

router.put(
  "/assignments/:id/status",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const delivery = await controller.updateDeliveryStatus(req, res);
    logger.info("Updated delivery status", {
      deliveryId: req.params.id,
      status: req.body.status,
    });
    res.json(delivery);
  })
);

// router.get(
//   "/history",
//   asyncHandler(async (req: Request, res: Response) => {
//     const history = await controller.getDeliveryHistory(req, res);
//     logger.info('Fetched delivery history', { userId: req.user?.userId });
//     res.json(history);
//   })
// );

router.get(
  "/current",
  asyncHandler(async (req: Request, res: Response) => {
    const current = await controller.getCurrentDelivery(req, res);
    logger.info('Fetched current delivery', { userId: req.user?.userId });
    res.json(current);
  })
);

export default router;
