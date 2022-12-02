import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException,  Inject} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  // constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,) {}
  constructor(@Inject('USER_REPOSITORY') private readonly userRepository: Repository<User>,) {}
  async findAll(){
    return this.userRepository.find();
  }

  async findOne(id: string){
    const user =  await this.userRepository.findOne({where: {id:+id}});

    if (!user) {
      throw new NotFoundException(`User ID $(id) not found`);
    }

    return user
  }

  create(createUserDto: CreateUserDto){
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto){
    const user = await this.userRepository.preload({id:+id, ...updateUserDto});
    
    if (!user){
      throw new NotFoundException(`User ID $(id) not found`)
    }

    return this.userRepository.save(user);
  }

  async remove(id: string){
    const user = await this.userRepository.findOne({where: {id:+id}});
    if (!user){
      throw new NotFoundException(`User ID $(id) not found`)
    }

    return this.userRepository.remove(user);
  
  }

}
