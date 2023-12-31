import { Request, Response, NextFunction } from "express";
import { User } from "../models/model.index";
import { IProject } from "../types/types.index";
import { ITask } from "../types/types.index";
import { ObjectId } from "mongodb";
require("dotenv").config();

const projectController = {
  createProject: async (req: Request, res: Response, next: NextFunction) => {
    const { name, color, description } = req.body;

    // Check if the required fields are provided
    if (!name || !color) {
      return res
        .status(400)
        .json({ error: "Name and color are required fields." });
    }

    let projectHours = 0;

    try {
      const userEmail = req.user?.email;

      // Check if the project name already exists for the current user
      const existingProject = await User.findOne({
        email: userEmail,
        "projects.name": name,
      });

      if (existingProject) {
        return res
          .status(409)
          .json({ error: "Project name already exists for the current user." });
      }

      const projectData: IProject = {
        _id: new ObjectId(),
        name,
        color,
        projectHours,
        description,
        userEmail: userEmail || "",
      };

      const user = req.user;
      if (user) {
        user.projects.push(projectData); // Add project to user's projects array
        await user.save();
      }

      res.status(200).json(true);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllProjectsData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userEmail = req.user?.email;

      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      let projects;
      try {
        projects = user.projects.map((project: IProject) => {
          const { _id, ...rest } = project;

          // Get the tasks for the current project
          const projectTasks = user.tasks.filter(
            (task: ITask) => task.projectId === project._id.toString()
          );

          //  Calculate the total hours for the project based on the tasks' beginTime and endTime
          const totalHours = projectTasks.reduce((acc: number, task: ITask) => {
            const beginTime: number = Number(task.beginTime);
            const endTime: number = Number(task.endTime);
            const taskHours = endTime - beginTime; // Convert milliseconds to hours
            acc += taskHours;
            return acc;
          }, 0);

          return {
            _id: _id ? _id.toString() : null,
            ...rest,
            projectHours: totalHours,
          };
        });
      } catch (error) {
        console.log("Error retrieving projects:", error);
        return res.status(500).json({ error: "Error retrieving projects" });
      }

      res.status(200).json(projects);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllProjectsNames: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userEmail = req.user?.email;

      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const projects = user.projects.map((project: IProject) => ({
        _id: project._id ? project._id.toString() : null,
        name: project.name,
      }));

      res.status(200).json(projects);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default projectController;
