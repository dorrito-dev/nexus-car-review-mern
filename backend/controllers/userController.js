import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        contactInfo: user.contactInfo,
        experience: user.experience,
        portfolioLink: user.portfolioLink,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const users = await User.find(statusFilter).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).json({ message: 'You cannot perform this action on your own account.' });
    }

    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.email === process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Root admin cannot be modified or deleted.' });
      }

      user.status = status || user.status;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).json({ message: 'You cannot perform this action on your own account.' });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      if (user.email === process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Root admin cannot be modified or deleted.' });
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};
