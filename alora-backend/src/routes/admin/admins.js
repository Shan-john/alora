const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ admins: [] }));
router.post('/', (req, res) => res.status(201).json({ message: 'Admin added' }));
router.delete('/:id', (req, res) => res.json({ message: 'Admin removed' }));

module.exports = router;
