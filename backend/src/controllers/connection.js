'use-strict';
const Connection = require('../models/connection');
const Notification = require('../models/notification');
const errorHandler = require('../shared/error-handler');

exports.sendConnectionRequest = async(req, res) => {
  const senderId = req.userId;
  const { receiverId } = req.body;
  try {
    await sequelize.transaction(async transaction => {
      const connectionRequest = await Connection.create(
        { sender_id: senderId, receiver_id: receiverId, status: 0 }, { transaction }
      );
      await Notification.create({ event_id: connectionRequest.id, event: 0 }, { transaction });
      res.send(true);
    });
  } catch (error) {
    errorHandler(res, new Error(error));
  }
}
