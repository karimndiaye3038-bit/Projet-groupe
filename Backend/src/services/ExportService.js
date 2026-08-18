const Project = require("../models/Project");
const Task = require("../models/Task");
const Member = require("../models/Member");
const TaskHistory = require("../models/TaskHistory");
const Settings = require("../models/Settings");

class ExportService {
  async exportData() {
    const projects = await Project.find().lean();
    const tasks = await Task.find().lean();
    const members = await Member.find().lean();
    const history = await TaskHistory.find().lean();
    const settings = await Settings.findOne().lean();

    return {
      exportDate: new Date().toISOString(),
      projects,
      tasks,
      members,
      settings,
      history
    };
  }
}

module.exports = new ExportService();
