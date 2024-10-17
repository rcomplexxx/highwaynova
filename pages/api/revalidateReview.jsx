





export default async function handler(req, res) {
    // Optionally, implement authentication or secret tokens
    if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    const { paths } = req.body; // Expecting an array of paths to revalidate
  
    if (!paths || !Array.isArray(paths)) {
      return res.status(400).json({ message: 'Invalid paths' });
    }
  
    try {
      for (const path of paths) {
        await res.revalidate(path);
      }
      return res.json({ revalidated: true, paths });
    } catch (err) {
      return res.status(500).json({ message: 'Revalidation failed', error: err.message });
    }
  }