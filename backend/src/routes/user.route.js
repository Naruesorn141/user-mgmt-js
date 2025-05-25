const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const secret = process.env.JWT_SECRET || 'secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, secret);
  res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' })
  res.json({ message: 'Logged out' })
})

router.get('/users', async (req, res) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'Unauthenticated' })

  try {
    const decoded = jwt.verify(token, secret)
    const me = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }
    })

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    })

    res.json({ users, me })
  } catch {
    res.status(403).json({ message: 'Invalid token' })
  }
})

router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET || 'secret';

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    const user = await prisma.user.create({
      data: { name, email, password, role }
    });

    res.json(user);
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Email already registered' })

    const user = await prisma.user.create({
      data: { name, email, password, role }
    })

    res.status(201).json({ message: 'Registered', user })
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' })
  }
})

router.put('/users/:id', async (req, res) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET || 'secret'

  try {
    const decoded = jwt.verify(token, secret)
    if (decoded.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })

    const { name, email, role } = req.body
    const id = parseInt(req.params.id)

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role }
    })

    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: 'Invalid request' })
  }
})

router.delete('/users/:id', async (req, res) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET || 'secret'

  try {
    const decoded = jwt.verify(token, secret)
    if (decoded.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })

    const id = parseInt(req.params.id)
    await prisma.user.delete({ where: { id } })

    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: 'Failed to delete user' })
  }
})

module.exports = router;