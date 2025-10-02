import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    projectId: string,
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    this.logger.log(`Creating task in project: ${projectId} for user: ${userId}`);

    // Verify project exists and user owns it
    await this.verifyProjectOwnership(projectId, userId);

    const task = this.tasksRepository.create({
      ...createTaskDto,
      projectId,
    });

    return this.tasksRepository.save(task);
  }

  async findAll(projectId: string, userId: string): Promise<Task[]> {
    this.logger.log(`Fetching all tasks for project: ${projectId}`);

    await this.verifyProjectOwnership(projectId, userId);

    return this.tasksRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    projectId: string,
    taskId: string,
    userId: string,
  ): Promise<Task> {
    this.logger.log(`Fetching task: ${taskId} from project: ${projectId}`);

    await this.verifyProjectOwnership(projectId, userId);

    const task = await this.tasksRepository.findOne({
      where: { id: taskId, projectId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
  }

  async update(
    projectId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    this.logger.log(`Updating task: ${taskId} in project: ${projectId}`);

    const task = await this.findOne(projectId, taskId, userId);

    Object.assign(task, updateTaskDto);

    return this.tasksRepository.save(task);
  }

  async remove(projectId: string, taskId: string, userId: string): Promise<void> {
    this.logger.log(`Deleting task: ${taskId} from project: ${projectId}`);

    const task = await this.findOne(projectId, taskId, userId);

    await this.tasksRepository.remove(task);
  }

  private async verifyProjectOwnership(
    projectId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }
}