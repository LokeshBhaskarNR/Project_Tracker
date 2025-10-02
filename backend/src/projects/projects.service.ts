import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    this.logger.log(`Creating project: ${createProjectDto.name} for user: ${userId}`);

    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: userId,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(userId: string): Promise<Project[]> {
    this.logger.log(`Fetching all projects for user: ${userId}`);

    return this.projectsRepository.find({
      where: { ownerId: userId },
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    this.logger.log(`Fetching project: ${id} for user: ${userId}`);

    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    this.logger.log(`Updating project: ${id} for user: ${userId}`);

    const project = await this.findOne(id, userId);

    Object.assign(project, updateProjectDto);

    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting project: ${id} for user: ${userId}`);

    const project = await this.findOne(id, userId);

    await this.projectsRepository.remove(project);
  }
}