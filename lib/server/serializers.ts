export function serializeMaterial(material: any) {
  return {
    id: String(material._id),
    title: material.title,
    subject: material.subject,
    description: material.description,
    uploadedBy: String(material.uploadedBy),
    uploadedByName: material.uploadedByName,
    uploadedAt: material.uploadedAt,
    fileUrl: material.fileUrl,
    fileType: material.fileType,
    views: material.views,
    downloads: material.downloads,
  };
}

export function serializeDoubt(doubt: any) {
  return {
    id: String(doubt._id),
    studentId: String(doubt.studentId),
    studentName: doubt.studentName,
    studentAvatar: doubt.studentAvatar,
    subject: doubt.subject,
    question: doubt.question,
    description: doubt.description,
    createdAt: doubt.createdAt,
    status: doubt.status,
    upvotes: doubt.upvotes,
    replies: (doubt.replies || []).map((reply: any) => ({
      id: String(reply._id),
      authorId: String(reply.authorId),
      authorName: reply.authorName,
      authorAvatar: reply.authorAvatar,
      content: reply.content,
      createdAt: reply.createdAt,
      isAccepted: reply.isAccepted,
    })),
  };
}

export function serializeChatMessage(message: any) {
  return {
    id: String(message._id),
    userId: message.userId,
    userName: message.userName,
    userAvatar: message.userAvatar,
    content: message.content,
    timestamp: message.timestamp,
    isAI: message.isAI,
  };
}
