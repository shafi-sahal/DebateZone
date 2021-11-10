'use-strict';
const Connection = require('../models/connection');
const errorHandler = require('../shared/error-handler');

exports.sendConnectionRequest = async(req, res) => {
  console.log(req.body);
  const { senderId, receiverId } = req.body;
  console.log(senderId);
  try {
    await Connection.create({
      sender_id: senderId,
      receiver_id: receiverId,
      status: 0
    });
  } catch (error) {
    errorHandler(res, new Error(error));
  }
}
