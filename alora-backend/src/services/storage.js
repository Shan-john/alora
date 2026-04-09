const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Save a file buffer to the local disk and return its public URL path.
 */
async function uploadToStorage(fileBuffer, originalName, folder = 'products') {
  const ext = path.extname(originalName) || '.jpg';
  const fileName = `${uuidv4()}${ext}`;
  const folderPath = path.join(UPLOADS_DIR, folder);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, fileBuffer);

  return `/uploads/${folder}/${fileName}`;
}

/**
 * Delete a file from the local disk by URL.
 */
async function deleteFromStorage(fileUrl) {
  try {
    if (!fileUrl.startsWith('/uploads/')) return false;
    
    // Convert /uploads/products/xyz.jpg to local path
    const relativePath = fileUrl.replace('/uploads/', '');
    const filePath = path.join(UPLOADS_DIR, relativePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Storage delete error:', err.message);
    return false;
  }
}

module.exports = { uploadToStorage, deleteFromStorage };
