import { Router } from 'express';
const WA = require('../../utils/functions');

// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here
router.get("/", (req, res) => {
  
  res.status(200).send({
    message: req.body+"success"
  });
});

router.post("/", async(req, res) => {
  
  await WA.sendMessage(`Welcome to our bot :) 💊🚰`,'whatsapp:+962799849386');

  res.status(200).send({
    message: "The message has been sent successfully!"
  });
  res.status(400).send({
    message: " Oh uh, something went wrong"
  });
  
})