import React, { useEffect, useState } from "react";
import moment from "moment";
import { get_attack_expiry_time } from "../api/attack_functions";
import { Text } from "react-native";

const getCountdown = (offset, startTime, expiryTime) => {
  const now = moment.utc().add(offset, 'milliseconds');
  const endTime = moment.utc(expiryTime);
  const remainingTime = moment.duration(endTime.diff(now));

  if (remainingTime.asMilliseconds() <= 0) {
    return "Countdown expired";
  }

  const minutes = Math.floor(remainingTime.asMinutes());
  const seconds = Math.floor(remainingTime.seconds());
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Timer = ({ attack_id, textStyles }) => {
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
        const timeLeft = getCountdown(timeOffset, startTime, expiryTime);
        setCountdown(timeLeft);
      }, 1000);

      return () => clearInterval(interval); // Clean up on component unmount
    }
  }, [timeOffset, startTime, expiryTime]);

  return <Text className={`text-xl font-plight ${textStyles}`}>{countdown}</Text>;
};

export default Timer;
