const { bucket } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Upload a file buffer to Firebase Storage and return the public URL.
 */
async function uploadToStorage(fileBuffer, originalName, folder = 'products') {
  const ext = path.extname(originalName);
  const fileName = `${folder}/${uuidv4()}${ext}`;
  const file = bucket.file(fileName);

  const token = uuidv4();

  await file.save(fileBuffer, {
    metadata: {
      contentType: getContentType(ext),
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
  return publicUrl;
}

function getContentType(ext) {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return types[ext.toLowerCase()] || 'application/octet-stream';
}

/**
 * Delete a file from Firebase Storage by URL.
 */
async function deleteFromStorage(fileUrl) {
  try {
    const urlPath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0]);
    await bucket.file(urlPath).delete();
    return true;
  } catch (err) {
    console.error('Storage delete error:', err.message);
    return false;
  }
}

module.exports = { uploadToStorage, deleteFromStorage };
