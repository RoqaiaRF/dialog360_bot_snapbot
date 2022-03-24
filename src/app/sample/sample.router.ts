import { Router } from 'express';
import sendTextMessage from '../../utils/functions';

// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here
router.get("/", (req, res) => {
  
  res.status(200).send({
    message: req.body+"sfdsadfssssssssssssssssdfaf"
  });
});

router.post("/", async(req, res) => {
  
  sendTextMessage()
});
