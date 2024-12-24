export const TimeAgo = ({ timestamp }: { timestamp: number | string }) => {
  const getTimeAgo = (timestamp: number | string): string => {
    const seconds = Math.floor(
      ((new Date() as any) - (new Date(timestamp) as any)) / 1000
    );

    // Define time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    // Handle future dates
    if (seconds < 0) {
      return "in the future";
    }

    // Handle just now
    if (seconds < 60) {
      return "just now";
    }

    // Find the appropriate interval
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);

      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
      }
    }
    return "";
  };

  return <span>{getTimeAgo(timestamp)}</span>;
};
