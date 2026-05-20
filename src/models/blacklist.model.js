const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required for black listing"],
    },
  },
  {
    timestamps: true,
  },
);

const tokenBlackListModel = mongoose.model(
  "blackListsTokens",
  blacklistTokenSchema,
);

module.exports = tokenBlackListModel;
