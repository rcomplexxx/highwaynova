


async function makeNewDescription(descriptionText, productId, dbConnection) {
  try {
    // Check if the product exists
    const productExistInDb = (await dbConnection.query(`SELECT 1 FROM products WHERE productId = ?`, [productId])).length > 0;

    if (productExistInDb) {
      // Update the existing product
      await dbConnection.query(`UPDATE products SET description = ? WHERE productId = ?`, [descriptionText, productId]);
    } else {
      // Insert a new product
      await dbConnection.query(`INSERT INTO products (productId, description) VALUES (?, ?)`, [productId, descriptionText]);
    }

    return true;
  } catch (error) {
    console.error('Error in makeNewDescription:', error);
    return false; // Return false or handle the error as needed
  }
}

module.exports = makeNewDescription;