const User = require('../models/User');
const Resume = require('../models/Resume');
const Job = require('../models/JobInterview');
const Question = require('../models/InterviewQA');
const fs = require('fs');
const path = require('path');

exports.getDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Total counts for summary
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalQuestions = await Question.countDocuments();

    // Paginated users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get counts per user for the page
    const userData = await Promise.all(users.map(async (user) => {
      const resumeCount = await Resume.countDocuments({ uid: user.uid });
      const jobCount = await Job.countDocuments({ uid: user.uid });
      const questionCount = await Question.countDocuments({ uid: user.uid });

      return {
        _id: user._id,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        resumeCount,
        jobCount,
        questionCount
      };
    }));

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    res.render('adminDashboard', {
      totalUsers,
      totalResumes,
      totalJobs,
      totalQuestions,
      users: userData,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete the user and their related data
    await User.findByIdAndDelete(userId);
    await Resume.deleteMany({ uid: userId });
    await Job.deleteMany({ uid: userId });
    await Question.deleteMany({ uid: userId });

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",") || [];

    if (ids.length === 0) {
      return res.status(400).send("No user IDs provided");
    }

    // Delete all selected users and related data
    await User.deleteMany({ _id: { $in: ids } });
    await Resume.deleteMany({ uid: { $in: ids } });
    await Job.deleteMany({ uid: { $in: ids } });
    await Question.deleteMany({ uid: { $in: ids } });

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting users");
  }
};

// controllers/adminController.js (updated viewUser)
exports.viewUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // Use user.uid (Firebase ID) to fetch related data
    const resumes = await Resume.find({ uid: user.uid }); // ✅ Correct identifier
    const jobs = await Job.find({ uid: user.uid }); // ✅
    const questions = await Question.find({ uid: user.uid }); // ✅

    res.render("userDetail", {
      user,
      resumes,
      jobs,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving user data");
  }
};




exports.viewResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).send('Resume not found');
    }

    // Construct absolute path to the file
    const filePath = path.resolve(resume.filePath);
    
    // Security check: ensure file is in uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).send('Invalid file path');
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.txt') contentType = 'text/plain';

    // Stream the file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};