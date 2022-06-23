export const formatDuration = (duration) => {
  try {
    return new Date(duration * 1000).toISOString().slice(14, 21);
  } catch(e) {
    return `00:00`;
  }
}
