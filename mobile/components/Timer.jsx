import React, { useEffect, useState } from "react";
import moment from "moment";
import { get_attack_expiry_time } from "../api/attack_functions";
import { Text } from "react-native";

const getCountdown = (offset, startTime, expiryTime, expiryMessage = "") => {
  const now = moment.utc().add(offset, 'milliseconds');
  const endTime = moment.utc(expiryTime);
  const remainingTime = moment.duration(endTime.diff(now));

  if (remainingTime.asMilliseconds() <= 0) {
    return expiryMessage;
  }

  const minutes = Math.floor(remainingTime.asMinutes());
  const seconds = Math.floor(remainingTime.seconds());

  if (isNaN(minutes) || isNaN(seconds)) {
    return ""; // Return an empty string if the countdown is invalid
  }

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Timer = ({ attack_id, textStyles, expiryMessage = "" }) => {
  const [countdown, setCountdown] = useState("");
  const [timeOffset, setTimeOffset] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await get_attack_expiry_time(attack_id);
        const serverTime = moment.utc(response.currentTime);
        const deviceTime = moment.utc();
        const offset = serverTime.diff(deviceTime);

        setTimeOffset(offset);
        setStartTime(moment.utc(response.createdAt));
        setExpiryTime(moment.utc(response.expiryTime));
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };

    fetchServerTime();
    setInterval(fetchServerTime, 60000);
  }, []);

  useEffect(() => {
    if (startTime && expiryTime) {
      const interval = setInterval(() => {
        const timeLeft = getCountdown(timeOffset, startTime, expiryTime, expiryMessage);
        setCountdown(timeLeft);
      }, 1000);

      return () => clearInterval(interval); // Clean up on component unmount
    }
  }, [timeOffset, startTime, expiryTime, expiryMessage]);

  return (
    countdown && (
      <Text className={`text-xl font-plight ${textStyles}`}>
        {countdown}
      </Text>
    )
  );
};

export default Timer;
