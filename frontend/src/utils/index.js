export const convertMarks = (obtained, originalTotal, targetTotal) => {
  if (!originalTotal || originalTotal === 0) {
    return 0;
  }
  const converted = (obtained / originalTotal) * targetTotal;
  return Math.round(converted * 100) / 100;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    ASSIGNED: 'badge-info',
    IN_PROGRESS: 'badge-warning',
    COMPLETED: 'badge-success',
    DRAFT: 'badge-warning',
    SUBMITTED: 'badge-success',
  };
  return statusColors[status] || 'badge-info';
};

export const getStatusText = (status) => {
  const statusTexts = {
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
  };
  return statusTexts[status] || status;
};

export const truncateText = (text, length = 50) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};
