import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Investment from '../models/Investment.js';
import Project from '../models/project.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { projectId, amount } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and amount are required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const existingInvestment = await Investment.findOne({
      project: projectId,
      investor: req.user.id
    });

    if (existingInvestment) {
      return res.status(400).json({
        success: false,
        message: 'You have already invested in this project'
      });
    }

    const investment = await Investment.create({
      project: projectId,
      investor: req.user.id,
      amount,
      status: 'pending'
    });

    await Project.findByIdAndUpdate(
      projectId,
      { $inc: { currentAmount: amount } }
    );

    res.status(201).json({
      success: true,
      investment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/user', protect, async (req, res) => {
  try {
    const investments = await Investment.find({ investor: req.user.id })
      .populate('project', 'title image targetAmount currentAmount')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      investments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/project/:projectId', async (req, res) => {
  try {
    const investments = await Investment.find({ project: req.params.projectId })
      .populate('investor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      investments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
