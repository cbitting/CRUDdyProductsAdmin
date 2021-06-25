import { Router } from 'express';


var healthApi = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     description: Check if the API is okay.
 *     responses:
 *       200:
 *         description: Returns an OK message to indicate server is working well.
 */
 healthApi.get("/", function (req, res) {
    return res.send({ status: "OK" });
  });


  export default healthApi;
