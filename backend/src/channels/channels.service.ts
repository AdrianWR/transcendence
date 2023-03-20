import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {

  constructor(
    @InjectRepository(Channel) private readonly channelsRepository: Repository<Channel>,) { }

  async create(createChannelDto: CreateChannelDto): Promise<Channel | null>  {
    return this.channelsRepository.save(createChannelDto);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelsRepository.find();
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: +id } });
 
     if (!channel) {
       throw new NotFoundException(`Channel Room ID ${id} not found`);
     }

     return channel
   }

  async update(id: number, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    const channel = await this.channelsRepository.preload({ id: +id, ...updateChannelDto});
    return this.channelsRepository.save(channel);
//    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
