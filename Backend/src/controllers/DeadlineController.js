const Deadline = require("../models/Deadline");


// =====================================================
// GET /api/deadlines
// Récupérer toutes les deadlines
// =====================================================

exports.getDeadlines = async (req, res) => {

    try {

        const deadlines = await Deadline
            .find()
            .populate("task")
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: deadlines.length,
            data: deadlines
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Erreur lors du chargement des deadlines",
            error: error.message
        });

    }

};


// =====================================================
// GET /api/deadlines/:id
// Récupérer une deadline
// =====================================================

exports.getDeadlineById = async (req, res) => {

    try {

        const deadline = await Deadline
            .findById(req.params.id)
            .populate("task");

        if (!deadline) {

            return res.status(404).json({
                success: false,
                message: "Deadline introuvable"
            });

        }

        res.status(200).json({
            success: true,
            data: deadline
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Erreur lors du chargement de la deadline",
            error: error.message
        });

    }

};


// =====================================================
// POST /api/deadlines
// Créer une deadline
// =====================================================

exports.createDeadline = async (req, res) => {

    try {

        const {
            title,
            description,
            task,
            date,
            priority,
            status
        } = req.body;


        if (!title || !date) {

            return res.status(400).json({
                success: false,
                message:
                    "Le titre et la date sont obligatoires"
            });

        }


        const deadline = await Deadline.create({

            title,

            description,

            task: task || null,

            date,

            priority:
                priority || "medium",

            status:
                status || "todo"

        });


        const populatedDeadline =
            await Deadline
                .findById(deadline._id)
                .populate("task");


        res.status(201).json({

            success: true,

            message:
                "Deadline créée avec succès",

            data: populatedDeadline

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Erreur lors de la création de la deadline",

            error: error.message

        });

    }

};


// =====================================================
// PUT /api/deadlines/:id
// Modifier une deadline
// =====================================================

exports.updateDeadline = async (req, res) => {

    try {

        const deadline =
            await Deadline.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            ).populate("task");


        if (!deadline) {

            return res.status(404).json({

                success: false,

                message:
                    "Deadline introuvable"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Deadline modifiée avec succès",

            data: deadline

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Erreur lors de la modification",

            error: error.message

        });

    }

};


// =====================================================
// PATCH /api/deadlines/:id/status
// Modifier uniquement le statut
// =====================================================

exports.updateDeadlineStatus = async (
    req,
    res
) => {

    try {

        const {
            status
        } = req.body;


        if (![
            "todo",
            "in-progress",
            "completed"
        ].includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    "Statut invalide"

            });

        }


        const deadline =
            await Deadline.findByIdAndUpdate(

                req.params.id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            ).populate("task");


        if (!deadline) {

            return res.status(404).json({

                success: false,

                message:
                    "Deadline introuvable"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Statut mis à jour",

            data: deadline

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Erreur lors de la modification du statut",

            error: error.message

        });

    }

};


// =====================================================
// DELETE /api/deadlines/:id
// Supprimer
// =====================================================

exports.deleteDeadline = async (
    req,
    res
) => {

    try {

        const deadline =
            await Deadline.findByIdAndDelete(
                req.params.id
            );


        if (!deadline) {

            return res.status(404).json({

                success: false,

                message:
                    "Deadline introuvable"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Deadline supprimée avec succès"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Erreur lors de la suppression",

            error: error.message

        });

    }

};