// const Task = require("../models/Task");

// // Créer une tâche
// exports.createTask = async (req, res) => {
//   try {
//     const task = await Task.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: "Tâche créée avec succès",
//       task,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     // });
//   }
// };

// // Récupérer toutes les tâches
// exports.getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       tasks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Récupérer une tâche
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Tâche introuvable",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       task,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Modifier une tâche
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Tâche introuvable",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Tâche modifiée avec succès",
//       task,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Supprimer une tâche
// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Tâche introuvable",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Tâche supprimée avec succès",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };