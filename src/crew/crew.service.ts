import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crew } from '../entities/crew.entity';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

@Injectable()
export class CrewService {
  constructor(
    @InjectRepository(Crew)
    private crewRepository: Repository<Crew>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ crew: Crew[], total: number }> {
    console.log('👨‍✈️ [CrewService] Finding all crew members');
    
    const [crew, total] = await this.crewRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [CrewService] Found ${crew.length} crew members`);
    return { crew, total };
  }

  async findOne(id: number): Promise<Crew> {
    console.log(`👨‍✈️ [CrewService] Finding crew member by ID: ${id}`);
    
    const crewMember = await this.crewRepository.findOne({
      where: { id }
    });
    
    if (!crewMember) {
      console.log(`❌ [CrewService] Crew member with ID ${id} not found`);
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }
    
    console.log(`✅ [CrewService] Crew member found`);
    return crewMember;
  }

  async create(createCrewDto: CreateCrewDto): Promise<Crew> {
    console.log('👨‍✈️ [CrewService] Creating new crew member');
    
    // Convert date strings to Date objects
    const crewData: Partial<Crew> = {
      name: createCrewDto.name,
      contact: createCrewDto.contact ?? null,
      role: createCrewDto.role,
      nationality: createCrewDto.nationality ?? null,
      id_number: createCrewDto.id_number ?? null,
      license_number: createCrewDto.license_number ?? null,
      license_issue_date: createCrewDto.license_issue_date ? new Date(createCrewDto.license_issue_date) : null,
      medical_class: createCrewDto.medical_class ?? null,
      medical_date: createCrewDto.medical_date ? new Date(createCrewDto.medical_date) : null,
      fixed_wing_training_date: createCrewDto.fixed_wing_training_date ? new Date(createCrewDto.fixed_wing_training_date) : null,
      rotorcraft_asel: createCrewDto.rotorcraft_asel ? new Date(createCrewDto.rotorcraft_asel) : null,
      rotorcraft_amel: createCrewDto.rotorcraft_amel ? new Date(createCrewDto.rotorcraft_amel) : null,
      rotorcraft_ases: createCrewDto.rotorcraft_ases ? new Date(createCrewDto.rotorcraft_ases) : null,
      rotorcraft_ames: createCrewDto.rotorcraft_ames ? new Date(createCrewDto.rotorcraft_ames) : null,
    };
    
    const crew = this.crewRepository.create(crewData);
    const savedCrew = await this.crewRepository.save(crew);
    console.log(`✅ [CrewService] Crew member created with ID: ${savedCrew.id}`);
    
    return savedCrew;
  }

  async update(id: number, updateCrewDto: UpdateCrewDto): Promise<Crew> {
    console.log(`👨‍✈️ [CrewService] Updating crew member ID: ${id}`);
    
    const crewMember = await this.findOne(id);

    // Convert date strings to Date objects if provided
    const updateData: Partial<Crew> = {};
    
    if (updateCrewDto.name !== undefined) {
      updateData.name = updateCrewDto.name;
    }
    if (updateCrewDto.contact !== undefined) {
      updateData.contact = updateCrewDto.contact ?? null;
    }
    if (updateCrewDto.role !== undefined) {
      updateData.role = updateCrewDto.role;
    }
    if (updateCrewDto.nationality !== undefined) {
      updateData.nationality = updateCrewDto.nationality ?? null;
    }
    if (updateCrewDto.id_number !== undefined) {
      updateData.id_number = updateCrewDto.id_number ?? null;
    }
    if (updateCrewDto.license_number !== undefined) {
      updateData.license_number = updateCrewDto.license_number ?? null;
    }
    if (updateCrewDto.license_issue_date !== undefined) {
      updateData.license_issue_date = updateCrewDto.license_issue_date ? new Date(updateCrewDto.license_issue_date) : null;
    }
    if (updateCrewDto.medical_class !== undefined) {
      updateData.medical_class = updateCrewDto.medical_class ?? null;
    }
    if (updateCrewDto.medical_date !== undefined) {
      updateData.medical_date = updateCrewDto.medical_date ? new Date(updateCrewDto.medical_date) : null;
    }
    if (updateCrewDto.fixed_wing_training_date !== undefined) {
      updateData.fixed_wing_training_date = updateCrewDto.fixed_wing_training_date ? new Date(updateCrewDto.fixed_wing_training_date) : null;
    }
    if (updateCrewDto.rotorcraft_asel !== undefined) {
      updateData.rotorcraft_asel = updateCrewDto.rotorcraft_asel ? new Date(updateCrewDto.rotorcraft_asel) : null;
    }
    if (updateCrewDto.rotorcraft_amel !== undefined) {
      updateData.rotorcraft_amel = updateCrewDto.rotorcraft_amel ? new Date(updateCrewDto.rotorcraft_amel) : null;
    }
    if (updateCrewDto.rotorcraft_ases !== undefined) {
      updateData.rotorcraft_ases = updateCrewDto.rotorcraft_ases ? new Date(updateCrewDto.rotorcraft_ases) : null;
    }
    if (updateCrewDto.rotorcraft_ames !== undefined) {
      updateData.rotorcraft_ames = updateCrewDto.rotorcraft_ames ? new Date(updateCrewDto.rotorcraft_ames) : null;
    }
    
    // Update fields
    Object.assign(crewMember, updateData);
    
    const updatedCrew = await this.crewRepository.save(crewMember);
    console.log(`✅ [CrewService] Crew member updated: ${updatedCrew.id}`);
    
    return updatedCrew;
  }

  async remove(id: number): Promise<void> {
    console.log(`👨‍✈️ [CrewService] Deleting crew member ID: ${id}`);
    const crewMember = await this.findOne(id);
    await this.crewRepository.remove(crewMember);
    console.log(`✅ [CrewService] Crew member deleted: ${crewMember.id}`);
  }
}

