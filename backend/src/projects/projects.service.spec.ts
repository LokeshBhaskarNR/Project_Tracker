import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;

  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
    ownerId: 'user1',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'New Description',
      };
      const userId = 'user1';

      mockRepository.create.mockReturnValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(createProjectDto, userId);

      expect(result).toEqual(mockProject);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createProjectDto,
        ownerId: userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects for a user', async () => {
      const userId = 'user1';
      mockRepository.find.mockResolvedValue([mockProject]);

      const result = await service.findAll(userId);

      expect(result).toEqual([mockProject]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ownerId: userId },
        relations: ['tasks'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a project if found and user owns it', async () => {
      const userId = 'user1';
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne('1', userId);

      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own the project', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      await expect(service.findOne('1', 'user2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateDto = { name: 'Updated Project' };
      const updatedProject = { ...mockProject, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update('1', updateDto, 'user1');

      expect(result.name).toBe('Updated Project');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.remove.mockResolvedValue(mockProject);

      await service.remove('1', 'user1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockProject);
    });
  });
});