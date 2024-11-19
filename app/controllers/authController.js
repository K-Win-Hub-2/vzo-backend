"use strict";

const User = require("../models/user");
const userShiftModel = require("../models/userShiftModel");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const CONFIG = require("../../config/db");
const { userShiftCalculate } = require("../helper/calculateVoucherWithShift");

exports.login = async (req, res) => {
  try {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error on the server",
        });
      }

      if (!user) {
        return res.status(404).send({
          error: true,
          message: "No user found",
        });
      }

      user.comparePassword(
        req.body.password,
        async function (err, user, reason) {
          if (user && user.isDeleted === true) {
            return res.status(403).send({
              error: true,
              message:
                "This account is deactivated. Pls contact an admin to activate it again",
            });
          }

          if (user && user.emailVerify === false) {
            return res.status(403).send({
              error: true,
              message:
                "Your email is not confirmed yet.Please confirm from your email.",
            });
          }

          if (user && user.isDeleted === false) {
            var token = jwt.sign(
              { credentials: `${user._id}.${CONFIG.jwtKey}.${user.email}` },
              CONFIG.jwtSecret,
              { expiresIn: CONFIG.defaultPasswordExpire }
            );

            const credentials = {
              id: user._id,

              isAdmin: user.isAdmin,
              isUser: user.isUser,
              isDoctor: user.isDoctor,
              token: token,
              user: {
                role: user.accRole,
                name: user.givenName,
                email: user.email,
                phone: user.phone,
              },
            };

            console.log("user", user);

            if (
              (user.createdBy && !user.lastLoginTime) ||
              user.status === "ARCHIVE"
            ) {
              credentials["firstTimeLogin"] = true;
            }

            user.lastLoginTime = new Date();
            user.save();

            const formattedDataForUserShift = {
              relatedShift: user.relatedShift ? user.relatedShift : null,
              relatedUser: user._id,
              givenName: user.givenName,
              role: user.role,
              email: user.email,
              shiftLoginTime: moment().toDate(),
            };

            await userShiftModel.create(formattedDataForUserShift);

            return res.status(200).send(credentials);
          }

          // otherwise we can determine why we failed
          var reasons = User.failedLogin;
          switch (reason) {
            case reasons.NOT_FOUND:
              return res.status(404).send({
                error: true,
                message: "No user found",
              });
            case reasons.PASSWORD_INCORRECT:
              // note: these cases are usually treated the same - don't tell
              // the user *why* the login failed, only that it did
              return res.status(401).send({
                error: true,
                message: "Wrong Password.",
              });
            case reasons.MAX_ATTEMPTS:
              // send email or otherwise notify user that account is
              // temporarily locked
              return res.status(429).send({
                error: true,
                message:
                  "Too Many Request. Your account is locked. Please try again after 30 minutes.",
              });
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;

    const lastShit = await userShiftModel
      .findOne({
        relatedUser: userId,
        shiftLogOutTime: { $exists: false },
      })
      .sort({ shiftLoginTime: -1 });

    if (!lastShit) {
      return res.status(404).send({ message: "No active shift found." });
    }

    lastShit.shiftLogOutTime = moment().toDate();
    await lastShit.save();

    const totalEarningsForToday = await userShiftCalculate(userId);

    res.status(200).send({
      auth: false,
      message: "Logout successful",
      totalEarnings: totalEarningsForToday || 0,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send({ message: "Logout failed" });
  }
};
